import { DetailsPageNavHelpers } from "./helpers/details_page_nav_helper";
import { FamilyRepository } from "./helpers/family_repository";
import { Family } from "./models/family";
import { Parent, Student } from "./models/person";
import { RawData } from "./models/raw_data";

function patchDetailsPage(table: HTMLTableElement) {
  fetch(chrome.runtime.getURL('/html/details_page.html')).then(r => r.text()).then(html => {
    table.insertAdjacentHTML('beforebegin', html);

    const container = document.getElementById("offcanvasRight");
    if (!container) {
      throw new Error("details_page.ts: Could not find #offcanvasRight.");
    }
    setupOffCanvasPage(container, table);
  });
}

function setupOffCanvasPage(container: HTMLElement, table: HTMLTableElement) {
  const familyId = getFamilyIdFromURL();
  FamilyRepository.getFamilyWithUniqueId(familyId).then(family => {
    const aFamily = family || new RawData(table).parse().withUniqueId(familyId);
    container.getElementsByClassName("offcanvas-body")[0].innerHTML = DetailsPageNavHelpers.generate(aFamily);

    setupPrimaryButton(family == null, aFamily);
    setupForms(aFamily);
  });
}

function setupPrimaryButton(isNewFamily: boolean, family: Family) {
  const button = document.getElementById("addNewFamily");
  if (!button) {
    throw new Error("details_page.ts: Could not find #addNewFamily.");
  }

  function buttonOnClick() {
    FamilyRepository.saveFamily(family).then(() => {
      // Update the button to say "View Family" and remove the click listener
      setupPrimaryButton(false, family);
      button?.removeEventListener("click", buttonOnClick);
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

function updateFamilyWithFormData(form: HTMLFormElement, family: Family) {
  const formData = new FormData(form);
  const personIndex = parseInt(form.dataset.personIndex || "");
  if (isNaN(personIndex)) {
    throw new Error("details_page.ts: Form does not have a personIndex.");
  }

  const person = family.people[personIndex];

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

// make sure we're on the details page
if (/\/parents\/\d+\/details$/.test(location.pathname)) {
  const table: HTMLTableElement | null = document.querySelector("#container > div > section > table");
  if (table) {
    patchDetailsPage(table);
  }
}
