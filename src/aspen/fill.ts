import { FamilyRepository } from "../common/family_repository";
import { Parent, Student } from "../common/models/person";
import { SupportedContext, SupportedPath } from "./helpers/supported_path";
import {
  fillStudentRegistration0, fillStudentRegistration1, fillStudentRegistration2
} from "./fill/student_registration";
import { fillAddress } from "./fill/address";
import { fillPhone } from "./fill/phone";
import { fillParent } from "./fill/parent";
import { fillFRCTracker, saveFRCTrackerDetails, setupFRCTrackerHooks, setupFRCTrackerTooltips } from "./fill/frc_tracker";
import { fillEducationalBackground, saveEducationComments, setupEducationalBackgroundHooks } from "./fill/educational_background";
import { saveStudentDetails } from "./fill/student_person_address_detail";
import { fillELL } from "./fill/programs_ell";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Aspen content script got message", request);
    if (Object.hasOwn(request, "familyId") &&
        Object.hasOwn(request, "personIndex") &&
        Object.hasOwn(request, "pathname") &&
        Object.hasOwn(request, "context")) {
      fill(request.familyId, request.personIndex, request.pathname, request.context).then((fillResponse) => {
        sendResponse({ type: "fillResponse", message: fillResponse });
      });
    } else {
      sendResponse({ message: `Aspen content script didn't understand request: ${request}` });
    }

    // https://stackoverflow.com/a/56483156
    return true;
  }
);

async function fill(familyId: string, personIndex: number, pathname: string, context: string | null) {
  const family = await FamilyRepository.getFamilyWithUniqueId(familyId);
  if (!family) {
    return "familyNotFound";
  }

  const person = family.people[personIndex];
  let response = "ok";

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
    case SupportedPath.ContactDetail:
      fillParent(person as Parent);
      break;
    case SupportedPath.ChildDetail:
      switch (context) {
        case SupportedContext.EducationalBackground:
          setupEducationalBackgroundHooks(family.uniqueId, personIndex);
          fillEducationalBackground(person as Student);
          saveEducationComments(family.uniqueId, personIndex);
          break;
        case SupportedContext.FRCTracker:
          setupFRCTrackerHooks(family.uniqueId, personIndex);
          fillFRCTracker(person as Student);
          setupFRCTrackerTooltips();
          saveFRCTrackerDetails(family.uniqueId, personIndex);
          break;
        case SupportedContext.ProgramsELL:
          fillELL(person as Student);
          break;
      }
      break;
    case SupportedPath.StudentPersonAddressDetail:
      await saveStudentDetails(family.uniqueId, personIndex);
      response = "refreshRequired";
      break;
    default:
      console.log("Unknown page", pathname);
      break;
  }

  return response;
}
