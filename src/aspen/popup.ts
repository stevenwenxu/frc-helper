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
        familyDetails.innerHTML = PopupNavHelper.generate(family)
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function(event) {
  // this is needed to make bootstrap work
  const _ = bootstrap;

  setupFamilyDetails();
  setupFamilyPicker();
});
