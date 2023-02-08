import { DetailsPageNavHelpers } from "./helpers/details_page_nav_helper";
import { FamilyRepository } from "./helpers/family_repository";
import { Family } from "./models/family";
import { RawData } from "./models/raw_data";

function insertButton(table: HTMLTableElement) {
  // if family exists, view family
  // otherwise, add new family
  fetch(chrome.runtime.getURL('/html/details_page.html')).then(r => r.text()).then(html => {
    table.insertAdjacentHTML('beforebegin', html);

    const container = document.getElementsByClassName("offcanvas-body")[0];
    setupPage(container, table);
  });
}

function setupPage(container: Element, table: HTMLTableElement) {
  const familyId = getFamilyIdFromURL();
  FamilyRepository.getFamilyWithUniqueId(familyId).then(family => {
    const aFamily = family || new RawData(table).parse();
    container.innerHTML = DetailsPageNavHelpers.generate(aFamily);
    setupButton(familyId, family == null, aFamily);
  });
}

function setupButton(familyId: string, isNewFamily: boolean, family: Family) {
  const button = document.getElementById("addNewFamily");
  if (!button) {
    throw new Error("details_page.ts: Could not find #addNewFamily.");
  }

  function buttonOnClick() {
    family.uniqueId = familyId;
    FamilyRepository.saveFamily(family).then(() => {
      // Update the button to say "View Family" and remove the click listener
      setupButton(familyId, false, family);
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
    insertButton(table);
  }
}
