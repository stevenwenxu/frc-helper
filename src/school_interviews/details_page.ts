import * as bootstrap from "bootstrap";
import { DetailsPageNavHelpers } from "./helpers/details_page_nav_helper";
import { FamilyRepository } from "../common/family_repository";
import { Family } from "../common/models/family";
import { Parent, Student } from "../common/models/person";
import { RawData } from "./models/raw_data";

function patchDetailsPage(table: HTMLTableElement) {
  fetch(chrome.runtime.getURL('/html/details_page.html')).then(r => r.text()).then(html => {
    table.insertAdjacentHTML('beforebegin', html);

    const container = document.getElementById("offcanvasRight")!;
    setupOffCanvasPage(container, table);
  });
}

async function setupOffCanvasPage(container: HTMLElement, table: HTMLTableElement) {
  const familyId = getFamilyIdFromURL();
  const family = await FamilyRepository.getFamilyWithUniqueId(familyId);

  const aFamily = family || new RawData(table).parse().withUniqueId(familyId).withVisitDate(new Date());
  container.getElementsByClassName("offcanvas-body")[0].innerHTML = DetailsPageNavHelpers.generate(aFamily);

  setupPrimaryButton(family == null, aFamily);
  setupForms(aFamily);
  setupNewPersonMenu(aFamily, container, table);
}

function setupPrimaryButton(isNewFamily: boolean, family: Family) {
  const button = document.getElementById("addNewFamily")!;

  function buttonOnClick() {
    FamilyRepository.saveFamily(family).then(() => {
      // Update the button to say "View Family" and remove the click listener
      setupPrimaryButton(false, family);
      button.removeEventListener("click", buttonOnClick);
    });
  }

  if (isNewFamily) {
    button.innerText = "Add New Family";
    button.addEventListener("click", buttonOnClick);
  } else {
    button.innerText = "View Family";
  }
}

function setupForms(family: Family) {
  const forms = document.querySelectorAll(".offcanvas-body > .tab-content > .tab-pane > form");
  (Array.from(forms) as HTMLFormElement[]).forEach(form => {
    form.addEventListener("change", () => {
      console.log(`details_page.ts: Saving changed form for ${form.dataset.personName}.`);
      updateFamilyWithFormData(form, family);
    });
  });
}

function setupNewPersonMenu(family: Family, container: HTMLElement, table: HTMLTableElement) {
  const dropdownMenu = document.getElementById("newPersonDropdown")!;

  dropdownMenu.querySelectorAll<HTMLButtonElement>("button.dropdown-item").forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const [_, person] = personIndexAndPersonFromDataset(button, family);
      const newPerson = JSON.parse(JSON.stringify(person));
      let newPersonIndex = 0;

      if (person instanceof Parent) {
        family.parents.push(newPerson);
        newPersonIndex = family.parents.length - 1;
      } else {
        family.students.push(newPerson);
        newPersonIndex = family.parents.length + family.students.length - 1;
      }

      FamilyRepository.saveFamily(family).then(() => {
        setupOffCanvasPage(container, table).then(() => {
          bootstrap.Tab.getOrCreateInstance(`#person-${newPersonIndex}-tab`).show();
        });
      });
    });
  });
}

function updateFamilyWithFormData(form: HTMLFormElement, family: Family) {
  const formData = new FormData(form);
  const [personIndex, person] = personIndexAndPersonFromDataset(form, family);

  person.firstName = formData.get("firstName") as string;
  person.middleName = formData.get("middleName") as string;
  person.lastName = formData.get("lastName") as string;
  person.phone = formData.get("phone") as string;
  person.address = formData.get("address") as string;

  if (person instanceof Parent) {
    person.email = formData.get("email") as string;
    person.parentNotes = formData.get("parentNotes") as string;
  } else {
    person.dateOfBirth = formData.get("dateOfBirth") as string;
    person.countryOfBirth = formData.get("countryOfBirth") as string;
    person.studentNotes = formData.get("studentNotes") as string;
  }

  family.people[personIndex] = person;

  FamilyRepository.saveFamily(family);
}

function getFamilyIdFromURL() {
  const pathnames = location.pathname.split("/");
  if (pathnames.length == 5) {
    return pathnames[3];
  }

  throw new Error("details_page.ts: Could not get family id.");
}

function personIndexAndPersonFromDataset(element: HTMLElement, family: Family): [number, Parent | Student] {
  const personIndex = parseInt(element.dataset.personIndex || "");
  if (isNaN(personIndex)) {
    throw new Error(`details_page.ts: ${element} does not have a personIndex.`);
  }

  return [personIndex, family.people[personIndex]];
}

// make sure we're on the details page
if (/\/parents\/\d+\/details$/.test(location.pathname)) {
  const table = document.querySelector<HTMLTableElement>("#container > div > section > table");
  if (table) {
    patchDetailsPage(table);
  }
}
