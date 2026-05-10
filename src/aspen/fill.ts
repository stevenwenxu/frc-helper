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
import { fillTransfer } from "./fill/transfer";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Aspen content script got message", request);
    if (request.type === "fillAspen") {
      fill(request.familyId, request.personIndex, request.pathname, request.context).then((fillResponse) => {
        // to update FillButton
        sendResponse(fillResponse);
        // for popup to respond
        chrome.runtime.sendMessage({ type: "fillResponse", message: fillResponse });
      });
    } else {
      console.log("ignoring request", request);
    }

    return true;
  }
);

async function markStepComplete(familyId: string, personIndex: number, stepName: string): Promise<string> {
  const family = await FamilyRepository.getFamilyWithUniqueId(familyId);
  if (!family) return "ok";

  const person = family.people[personIndex];
  if (!person.completedSteps.includes(stepName)) {
    person.completedSteps.push(stepName);
  }

  await FamilyRepository.saveFamily(family);

  // Return refreshRequired to trigger popup update
  return "refreshRequired";
}

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
      response = "ok";
      break;
    case SupportedPath.StudentRegistration1:
      fillStudentRegistration1(person as Student);
      response = "ok";
      break;
    case SupportedPath.StudentRegistration2:
      fillStudentRegistration2();
      response = "ok";
      break;
    case SupportedPath.MultiplePersonAddressChildDetail:
      switch (context) {
        case SupportedContext.Address:
          fillAddress(person);
          response = await markStepComplete(familyId, personIndex, "address");
          break;
        case SupportedContext.Phone:
          fillPhone(person);
          response = await markStepComplete(familyId, personIndex, "phone");
          break;
      }
      break;
    case SupportedPath.AddRecord:
    case SupportedPath.ContactDetail:
      fillParent(person as Parent);
      response = await markStepComplete(familyId, personIndex, "parent");
      break;
    case SupportedPath.ChildDetail:
      switch (context) {
        case SupportedContext.EducationalBackground:
          setupEducationalBackgroundHooks(family.uniqueId, personIndex);
          fillEducationalBackground(person as Student);
          await saveEducationComments(family.uniqueId, personIndex);
          response = await markStepComplete(familyId, personIndex, "educationalBackground");
          break;
        case SupportedContext.FRCTracker:
          setupFRCTrackerHooks(family.uniqueId, personIndex);
          fillFRCTracker(person as Student);
          setupFRCTrackerTooltips();
          await saveFRCTrackerDetails(family.uniqueId, personIndex);
          response = await markStepComplete(familyId, personIndex, "frcTracker");
          break;
        case SupportedContext.ProgramsELL:
          fillELL(person as Student);
          response = await markStepComplete(familyId, personIndex, "ell");
          break;
      }
      break;
    case SupportedPath.StudentPersonAddressDetail:
      await saveStudentDetails(family.uniqueId, personIndex);
      response = "ok";
      break;
    case SupportedPath.StudentTransfer:
      response = fillTransfer(person as Student);
      response = "ok";
      break;
    default:
      console.error("Unknown page", pathname);
      response = "unknownPage";
      break;
  }

  return response;
}
