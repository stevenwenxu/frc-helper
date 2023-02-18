import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { FamilyRepository } from "../common/family_repository";
import { PopupBuilder } from "./helpers/popup_builder";
import { Family } from "../common/models/family";
import { SupportedPath } from "./helpers/supported_path";
import { Parent, Student } from "../common/models/person";

function setupFamilyPicker() {
  const familyPicker = document.getElementById("familyPicker")!;
  FamilyRepository.getFamilies().then((families) => {
    familyPicker.innerHTML = PopupBuilder.buildFamilyPicker(families);
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
        familyDetails.innerHTML = PopupBuilder.generate(family);
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
      const tabs = await chrome.tabs.query({ active: true, url: supported_urls });
      console.log("State of tabs", tabs.map(tab => [tab.url, tab.active]));

      if (tabs.length === 0) {
        alert("You don't have any active Aspen page to fill.");
      } else {
        let tab = tabs.at(-1)!;
        console.log("Filling tab: ", tab.url);

        const personIndex = parseInt(fillButton.dataset.personIndex!);
        const person = family.people[personIndex];
        const pathname = new URL(tab.url!).pathname;
        const expected = expectedPersonType(pathname);
        if (!expected.includes(person.constructor)) {
          alert(`You selected a ${person.constructor.name}, but the form is for a ${expected.join(" or ")}.`);
          return;
        }

        chrome.tabs.sendMessage(tab.id!, {
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

function expectedPersonType(pathname: string): Function[] {
  switch (pathname) {
    case SupportedPath.StudentRegistration0:
    case SupportedPath.StudentRegistration1:
    case SupportedPath.StudentRegistration2:
      return [Student];
    case SupportedPath.MultiplePersonAddressChildDetail:
      return [Student, Parent];
    case SupportedPath.AddRecord:
      return [Parent];
    default:
      console.log("Unknown path:", pathname);
      return [];
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  // this is needed to make bootstrap work
  const _ = bootstrap;

  setupFamilyDetails();
  setupFamilyPicker();
});
