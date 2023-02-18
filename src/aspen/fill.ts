import { FamilyRepository } from "../common/family_repository";
import { Parent, Student } from "../common/models/person";
import { SupportedPath } from "./helpers/supported_path";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.hasOwnProperty("family") &&
        request.hasOwnProperty("personIndex") &&
        request.hasOwnProperty("pathname")) {
      fill(request.family, request.personIndex, request.pathname);
      sendResponse({ message: "ok" });
    }
  }
);

function fill(familySerialized: any, personIndex: number, pathname: string) {
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
    case SupportedPath.multiplePersonAddressChildDetail:
      fillAddress(person);
      break;
    default:
      console.log("Unknown page", pathname);
      break;
  }
}

function fillStudentRegistration0(student: Student) {
  const elements = document.forms.namedItem("registrationSourceForm")!.elements;

  setValue(elements.namedItem("value(psnNameFirst)") as HTMLInputElement, student.firstName);
  setValue(elements.namedItem("value(psnNameLast)") as HTMLInputElement, student.lastName);
  setValue(elements.namedItem("value(psnDob)") as HTMLInputElement, student.dateOfBirth);
}

function fillStudentRegistration1(student: Student) {
  const elements = document.forms.namedItem("registrationDetailForm")!.elements;

  setValue(elements.namedItem("propertyValue(relStdPsnOid_psnFieldC023)") as HTMLInputElement, student.middleName);

  const birthdate = (elements.namedItem("propertyValue(relStdPsnOid_psnDob)") as HTMLInputElement).value;
  const birthYear = parseInt(birthdate.split("/")[2]);
  setValue(
    elements.namedItem("propertyValue(stdFieldA036)") as HTMLInputElement,
    `${birthYear + 14}-${birthYear + 15}`
  );
}

function fillStudentRegistration2() {
  const elements = document.forms.namedItem("wizardForm")!.elements;

  setValue(elements.namedItem("value(enrEnrDate)") as HTMLInputElement, new Date().toDateString());
}

function fillAddress(person: Parent | Student) {
  const elements = document.forms.namedItem("multiplePersonAddressChildDetailForm")!.elements;

  const address = person.address
    .split(",")[0]
    .replace(/ottawa|nepean|kanata|stittsville|manotick|barrhaven|orleans/i, "")
    .replace(/ontario| ON /i, "")
    .replace(/[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d/i, "")
    .replace(/canada/i, "")
    .replace(/crescent/i, "cres")
    .replace(/street/i, "st")
    .replace(/avenue/i, "ave")
    .replace(/road/i, "rd")
    .replace(/court/i, "crt")
    .replace(/drive/i, "dr")
    .replace(/boulevard/i, "blvd")
    .replace(/parkway/i, "pkwy")
    .replace(/circle/i, "cir")
    .replace(/highway/i, "hwy")
    .replace(/private/i, "pvt");
  const addressElement = elements.namedItem("propertyValue(relPadAdrOid_adrFieldC010)") as HTMLInputElement;
  setValue(addressElement, address);
  addressElement.dispatchEvent(new Event("keyup"));
}

function setValue(element: HTMLInputElement, value: string) {
  element.value = value;
  element.dispatchEvent(new Event("change"));
  element.style.backgroundColor = "yellow";
  element.style.borderColor = "green";
}
