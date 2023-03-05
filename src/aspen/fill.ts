import { FamilyRepository } from "../common/family_repository";
import { Parent, Student } from "../common/models/person";
import { SupportedContext, SupportedPath } from "./helpers/supported_path";
import {
  fillStudentRegistration0, fillStudentRegistration1, fillStudentRegistration2
} from "./fill/student_registration";
import { fillAddress } from "./fill/address";
import { fillPhone } from "./fill/phone";
import { fillParent } from "./fill/parent";
import { fillFRCTracker, setupFRCTrackerHooks, setupFRCTrackerTooltips } from "./fill/frc_tracker";
import { fillEducationalBackground, setupEducationalBackgroundHooks } from "./fill/educational_background";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.hasOwnProperty("family") &&
        request.hasOwnProperty("personIndex") &&
        request.hasOwnProperty("pathname") &&
        request.hasOwnProperty("context")) {
      fill(request.family, request.personIndex, request.pathname, request.context);
      sendResponse({ message: "ok" });
    } else {
      sendResponse({ message: `unknown request: ${Object.keys(request)}` });
    }
  }
);

function fill(familySerialized: any, personIndex: number, pathname: string, context: string | null) {
  const family = FamilyRepository.familyFromStoredFamily(familySerialized);
  const person = family.people[personIndex];

  switch (pathname) {
    case SupportedPath.StudentRegistration0:
      fillStudentRegistration0(person as Student);
      break;
    case SupportedPath.StudentRegistration1:
      fillStudentRegistration1(person as Student);
      break;
    case SupportedPath.StudentRegistration2:
      fillStudentRegistration2();
      break;
    case SupportedPath.MultiplePersonAddressChildDetail:
      switch (context) {
        case SupportedContext.Address:
          fillAddress(person);
          break;
        case SupportedContext.Phone:
          fillPhone(person);
          break;
      }
      break;
    case SupportedPath.AddRecord:
      fillParent(person as Parent);
      break;
    case SupportedPath.ChildDetail:
      switch (context) {
        case SupportedContext.EducationalBackground:
          setupEducationalBackgroundHooks(person as Student);
          fillEducationalBackground(person as Student);
          break;
        case SupportedContext.FRCTracker:
          fillFRCTracker(person as Student);
          setupFRCTrackerHooks(person as Student);
          setupFRCTrackerTooltips();
          break;
      }
      break;
    default:
      console.log("Unknown page", pathname);
      break;
  }
}

export function setValue(element: HTMLInputElement | null, value: string) {
  if (!element) {
    return;
  }

  element.value = value;
  element.dispatchEvent(new Event("change"));
  element.style.backgroundColor = "yellow";
  element.style.borderColor = "green";
}
