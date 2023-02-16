import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { FamilyRepository } from "../common/family_repository";
import { PopupNavHelper } from "./helpers/popup_nav_helper";
import { Family } from "../common/models/family";
import { SupportedPath } from "./helpers/supported_path";

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
      const supported_urls = Object.values(SupportedPath).map((path) => {
        return `https://ocdsb.myontarioedu.ca${path}*`
      });
      const tabs = await chrome.tabs.query({ url: supported_urls });

      if (tabs.length === 0) {
        alert("You don't have an Aspen page to fill.");
      } else if (tabs.length > 1) {
        alert("You have multiple fillable Aspen pages open. Please close all but one.");
      } else {
        const personIndex = parseInt(fillButton.dataset.personIndex!);
        const person = family.people[personIndex];
        const pathname = new URL(tabs[0].url!).pathname;
        const expected = expectedPersonType(pathname);
        if (!expected.includes(person.constructor.name)) {
          alert(`You selected a ${person.constructor.name}, but the form is for a ${expected.join(" or ")}.`);
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

function expectedPersonType(pathname: string) : string[] {
  switch (pathname) {
    case SupportedPath.StudentRegistration0:
    case SupportedPath.StudentRegistration1:
    case SupportedPath.StudentRegistration2:
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
