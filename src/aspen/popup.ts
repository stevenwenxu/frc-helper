import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { FamilyRepository } from "../common/family_repository";
import { PopupNavHelper } from "./helpers/popup_nav_helper";

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
        setupFillButtons();
      }
    });
  });
}

function setupFillButtons() {
  const fillButtons = document.querySelectorAll<HTMLButtonElement>(".tab-pane button");
  for (const fillButton of Array.from(fillButtons)) {
    fillButton.addEventListener("click", () => {
      const familyUniqueId = fillButton.dataset.familyId!;
      const personIndex = parseInt(fillButton.dataset.personIndex!);
      chrome.tabs.query({ url: [
        "https://ocdsb.myontarioedu.ca/aspen/studentRegistration*",
        "https://ocdsb.myontarioedu.ca/aspen/studentPersonAddressDetail*"
      ] }, (tabs) => {
        if (tabs.length === 0) {
          alert("You don't have an Aspen page to fill.");
        } else if (tabs.length > 1) {
          alert("You have multiple fillable Aspen pages open. Please close all but one.");
        } else {
          chrome.windows.update(tabs[0].windowId!, { focused: true });
          chrome.tabs.update(tabs[0].id!, { active: true });
          chrome.tabs.sendMessage(tabs[0].id!, {
            familyUniqueId: familyUniqueId,
            personIndex: personIndex
          }, (response) => {
            console.log("Got response:", response);
          });
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  // this is needed to make bootstrap work
  const _ = bootstrap;

  setupFamilyDetails();
  setupFamilyPicker();
});
