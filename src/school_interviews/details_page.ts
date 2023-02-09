import { DetailsPageNavHelpers } from "./helpers/details_page_nav_helper";
import { FamilyRepository } from "./helpers/family_repository";
import { Family } from "./models/family";
import { Student } from "./models/person";
import { RawData } from "./models/raw_data";

function patchDetailsPage(table: HTMLTableElement) {
  fetch(chrome.runtime.getURL('/html/details_page.html')).then(r => r.text()).then(html => {
    table.insertAdjacentHTML('beforebegin', html);

    const container = document.getElementsByClassName("offcanvas-body")[0];
    setupOffCanvasPage(container, table);
  });
}

function setupOffCanvasPage(container: Element, table: HTMLTableElement) {
  const familyId = getFamilyIdFromURL();
  FamilyRepository.getFamilyWithUniqueId(familyId).then(family => {
    const aFamily = family || new RawData(table).parse();
    container.innerHTML = DetailsPageNavHelpers.generate(aFamily);
    setupPrimaryButton(familyId, family == null, aFamily);
    setupForms(aFamily);
  });
}

function setupPrimaryButton(familyId: string, isNewFamily: boolean, family: Family) {
  const button = document.getElementById("addNewFamily");
  if (!button) {
    throw new Error("details_page.ts: Could not find #addNewFamily.");
  }

  function buttonOnClick() {
    family.uniqueId = familyId;
    FamilyRepository.saveFamily(family).then(() => {
      // Update the button to say "View Family" and remove the click listener
      setupPrimaryButton(familyId, false, family);
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
  (Array.from(forms) as HTMLFormElement[]).forEach((form, index) => {
    const person = family.people[index];
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      person.name = formData.get("name") as string;
      person.email = formData.get("email") as string;
      person.phone = formData.get("phone") as string;
      person.address = formData.get("address") as string;
      person.extraNotes = formData.get("extraNotes") as string;
      if (person instanceof Student) {
        person.dateOfBirth = formData.get("dateOfBirth") as string;
        person.countryOfBirth = formData.get("countryOfBirth") as string;
        person.studentNotes = formData.get("studentNotes") as string;
      }
      family.people[index] = person;
      FamilyRepository.saveFamily(family);
    });
  });
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
