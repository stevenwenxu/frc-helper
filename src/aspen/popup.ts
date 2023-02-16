import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { FamilyRepository } from "../common/family_repository";
import { PopupNavHelper } from "./helpers/popup_nav_helper";
import { Family } from "../common/models/family";
import { Parent, Student } from "../common/models/person";

function setupFamilyPicker() {
  const familyPicker = document.getElementById("familyPicker")!;
  let innerHTML = "";
  FamilyRepository.getFamilies().then((families) => {
    for (const family of families) {
      innerHTML += `<option value=${family.uniqueId}>${family.uniqueId}</option>`;
    }
    familyPicker.innerHTML = innerHTML;
    familyPicker.dispatchEvent(new Event("change"));
  });
}

function setupFamilyDetails() {
  const familyPicker = document.getElementById("familyPicker")! as HTMLSelectElement;
  const familyDetails = document.getElementById("familyDetails")!;
  familyPicker.addEventListener("change", () => {
    const familyUniqueId = familyPicker.value;
    FamilyRepository.getFamilyWithUniqueId(familyUniqueId).then((family) => {
      if (family) {
        familyDetails.innerHTML = PopupNavHelper.generate(family);
        setupFillButtons(family);
      }
    });
  });
}

function setupFillButtons(family: Family) {
  const fillButtons = document.querySelectorAll<HTMLButtonElement>(".tab-pane button");
  for (const fillButton of Array.from(fillButtons)) {
    fillButton.addEventListener("click", async () => {
      const tabs = await chrome.tabs.query({ url: [
        "https://ocdsb.myontarioedu.ca/aspen/studentRegistration*",
        "https://ocdsb.myontarioedu.ca/aspen/studentPersonAddressDetail*"
      ]});

      if (tabs.length === 0) {
        alert("You don't have an Aspen page to fill.");
      } else if (tabs.length > 1) {
        alert("You have multiple fillable Aspen pages open. Please close all but one.");
      } else {
        const personIndex = parseInt(fillButton.dataset.personIndex!);
        const person = family.people[personIndex];
        const pathname = new URL(tabs[0].url!).pathname;
        if (!expectedPersonType(pathname).includes(person.constructor.name)) {
          notifyWrongType(person.constructor.name, expectedPersonType(pathname).join(" or "));
          return;
        }

        chrome.windows.update(tabs[0].windowId!, { focused: true });
        chrome.tabs.update(tabs[0].id!, { active: true });
        chrome.tabs.sendMessage(tabs[0].id!, {
          family: family,
          personIndex: personIndex,
          pathname: pathname
        }, (response) => {
          console.log("Got response:", response);
        });
      }
    });
  }
}

function notifyWrongType(selected: string, destination: string) {
  alert(`You selected to fill a ${selected}, but this page is for ${destination}.`);
}

function expectedPersonType(pathname: string) : string[] {
  switch (pathname) {
    case "/aspen/studentRegistration0.do":
    case "/aspen/studentRegistration1.do":
    case "/aspen/studentRegistration2.do":
      return ["Student"];
    default:
      return [];
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  // this is needed to make bootstrap work
  const _ = bootstrap;

  setupFamilyDetails();
  setupFamilyPicker();
});
