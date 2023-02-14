import "../scss/styles.scss";
import { FamilyRepository } from "../common/family_repository";
import { Student } from "../common/models/person";

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
      let innerHTML = "";
      let parentIndex = 1;
      let studentIndex = 1;

      if (family) {
        family.people.forEach((person, index) => {
          const displayName = person instanceof Student ? `Student ${studentIndex++}` : `Parent ${parentIndex++}`;
          innerHTML += `
          <div class="card my-3">
            <div class="card-body">
              <h5 class="card-title">${displayName}</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Fill</a>
            </div>
          </div>
          `;
        });
      }

      familyDetails.innerHTML = innerHTML;
    });
  });
}

document.addEventListener("DOMContentLoaded", function(event) {
  setupFamilyDetails();
  setupFamilyPicker();
});
