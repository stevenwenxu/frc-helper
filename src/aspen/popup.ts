import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { FamilyRepository } from "../common/family_repository";
import { PopupBuilder } from "./helpers/popup_builder";
import { Family } from "../common/models/family";
import { SupportedPath } from "./helpers/supported_path";
import { Student } from "../common/models/person";
import { setupMathAssessmentButtons } from "./math_assessment/math_assessment";
import { setupEmailButtons } from "./email/email";
import { setupStepButtons } from "./helpers/step_pdf";
import { setupGradeActions } from "./helpers/set_grade";

function setupFamilyPicker() {
  const familyPicker = document.getElementById("familyPicker")!;
  familyPicker.addEventListener("change", renderFamilyDetails);
  FamilyRepository.getFamilies().then((families) => {
    familyPicker.innerHTML = PopupBuilder.buildFamilyPicker(families);
    familyPicker.dispatchEvent(new Event("change"));
  });
}

function setupDeleteFamilyButton() {
  const deleteFamilyButton = document.getElementById("deleteFamily")!;
  deleteFamilyButton.addEventListener("click", async () => {
    const familyPicker = document.getElementById("familyPicker") as HTMLSelectElement;
    const familyUniqueId = familyPicker.value;
    if (familyPicker.selectedOptions.length !== 1) {
      return;
    }
    if (!confirm(`Are you sure you want to delete ${familyPicker.selectedOptions[0].textContent}?`)) {
      return;
    }
    await FamilyRepository.deleteFamily(familyUniqueId);
    document.location.reload();
  });
}

async function updateFamilyPickerDisplayName() {
  const familyPicker = document.getElementById("familyPicker") as HTMLSelectElement;
  if (familyPicker.selectedOptions.length !== 1) {
    return;
  }

  const family = await FamilyRepository.getFamilyWithUniqueId(familyPicker.value);
  if (family) {
    familyPicker.selectedOptions[0].textContent = family.displayName;
  }
}

export async function renderFamilyDetails() {
  const familyPicker = document.getElementById("familyPicker")! as HTMLSelectElement;
  const familyDetails = document.getElementById("familyDetails")!;
  if (familyPicker.selectedOptions.length !== 1) {
    familyDetails.innerHTML = PopupBuilder.buildEmptyState();
    return;
  }

  const family = await FamilyRepository.getFamilyWithUniqueId(familyPicker.value);
  if (family) {
    familyDetails.innerHTML = PopupBuilder.generate(family);
    // Take familyId instead of Family because the family object (at the time of UI creation) could be stale after
    // picking up more fields from Aspen.
    setupFillButtons(family.uniqueId);
    setupMathAssessmentButtons(family.uniqueId);
    setupGradeActions(family.uniqueId);
    setupEmailButtons(family.uniqueId);
    setupStepButtons(family.uniqueId);
  }
}

export async function reRender() {
  const currentSelectedPerson = document.querySelector(".nav-link.active")!;
  await updateFamilyPickerDisplayName();
  await renderFamilyDetails();
  bootstrap.Tab.getOrCreateInstance(`#${currentSelectedPerson.id}`).show();
}

function setupFillButtons(familyId: string) {
  const fillButtons = document.querySelectorAll<HTMLButtonElement>(".tab-pane button[data-function='fill'");
  for (const fillButton of Array.from(fillButtons)) {
    fillButton.addEventListener("click", async () => {
      const supportedUrls = Object.values(SupportedPath).map((path) => {
        return `https://ocdsb.myontarioedu.ca${path}*`
      });
      const tabs = await chrome.tabs.query({ active: true, url: supportedUrls });
      console.log("State of tabs", tabs.map(tab => [tab.url, tab.active]));

      if (tabs.length === 0) {
        alert("You don't have any active Aspen page to fill.");
      } else {
        let tab = tabs.at(-1)!;
        console.log("Filling tab: ", tab.url);

        const personIndex = parseInt(fillButton.dataset.personIndex!);
        const personType = fillButton.dataset.personType!;
        const url = new URL(tab.url!);
        const pathname = url.pathname;
        const context = url.searchParams.get("context");
        const expected = expectedPersonType(pathname);
        if (!expected.includes(personType)) {
          alert(`You selected a ${personType}, but the form is for a ${expected.join(" or ")}.`);
          return;
        }

        const fillResponse = await chrome.tabs.sendMessage(tab.id!, {
          familyId: familyId,
          personIndex: personIndex,
          pathname: pathname,
          context: context
        });
        console.log("Popup fill response:", fillResponse);
        if (fillResponse.type === "fillResponse") {
          switch (fillResponse.message) {
            case "familyNotFound":
              alert("This family has been deleted. Please reload the page.");
              break;
            case "ok":
              break;
            case "refreshRequired":
              await reRender();
              break;
            default:
              console.error("Unknown fill response message:", fillResponse.message);
              break;
          }
        } else {
          console.error("Unknown fill response:", fillResponse);
        }
      }
    });
  }
}

function expectedPersonType(pathname: string) {
  switch (pathname) {
    case SupportedPath.StudentRegistration0:
    case SupportedPath.StudentRegistration1:
    case SupportedPath.StudentRegistration2:
    case SupportedPath.ChildDetail:
    case SupportedPath.StudentPersonAddressDetail:
      return ["student"];
    case SupportedPath.MultiplePersonAddressChildDetail:
      return ["student", "parent"];
    case SupportedPath.AddRecord:
      return ["parent"];
    default:
      console.log("Unknown path:", pathname);
      return [];
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  // this is needed to make bootstrap work
  const _ = bootstrap;

  setupFamilyPicker();
  setupDeleteFamilyButton();
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Popup got message:", request);
    if (request.hasOwnProperty("type")) {
      switch (request.type) {
        case "confirmUpdateStudentName":
          const response = confirm(`Do you want to update ${request.oldName} to ${request.newName}?`);
          sendResponse({ confirmUpdateStudentName: response });
          break;
        default:
          sendResponse({ message: `Popup didn't understand request: ${request}` });
          break;
      }
    } else {
      sendResponse({ message: `Popup didn't understand request: ${request}` });
    }
  }
);
