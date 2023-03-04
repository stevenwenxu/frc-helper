import { FamilyRepository } from "../common/family_repository";
import { Parent, Student } from "../common/models/person";
import { AddressSanitizer } from "./helpers/address_sanitizer";
import { EducationalBackgroundFields } from "./helpers/educational_background_fields";
import { FRCTrackerFields } from "./helpers/frc_tracker_fields";
import { SupportedContext, SupportedPath } from "./helpers/supported_path";

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
      fillAddressAndPhone(person);
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

function fillAddressAndPhone(person: Parent | Student) {
  const elements = document.forms.namedItem("multiplePersonAddressChildDetailForm")!.elements;

  // Fill postal code before address to trigger a more accurate address search
  setValue(
    elements.namedItem("propertyValue(relPadAdrOid_adrPostalCode)") as HTMLInputElement | null,
    AddressSanitizer.postalCode(person.address)
  );

  const sanitizedAddress = AddressSanitizer.sanitized(person.address);

  const addressElement = elements.namedItem("propertyValue(relPadAdrOid_adrFieldC010)") as HTMLInputElement | null;
  setValue(addressElement, AddressSanitizer.addressToFill(sanitizedAddress));
  addressElement?.dispatchEvent(new Event("keyup"));

  setValue(
    elements.namedItem("propertyValue(relPadAdrOid_adrFieldB001)") as HTMLInputElement | null,
    AddressSanitizer.unitType(sanitizedAddress)
  );

  setValue(
    elements.namedItem("propertyValue(relPadAdrOid_adrFieldA001)") as HTMLInputElement | null,
    AddressSanitizer.unitNumber(sanitizedAddress)
  );

  setValue(
    elements.namedItem("propertyValue(padPhoneType)") as HTMLInputElement | null,
    "Cell"
  );

  setValue(
    elements.namedItem("propertyValue(padFieldB001)") as HTMLInputElement | null,
    person.phone
  );
}

function fillParent(parent: Parent) {
  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;

  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnNameFirst)") as HTMLInputElement,
    parent.firstName
  );
  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnNameMiddle)") as HTMLInputElement,
    parent.middleName
  )
  setValue(
    elements.namedItem("relCtjCntOid.relCntPsnOid.psnNameLast") as HTMLInputElement,
    parent.lastName
  );
  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnEmail01)") as HTMLInputElement,
    parent.email
  );
  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnFieldA011)") as HTMLInputElement,
    "S"
  );
}

function fillFRCTracker(student: Student) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;

  setValue(
    elements.namedItem("propertyValue(pgmActionStart)") as HTMLInputElement,
    new Date().toDateString()
  );

  setValue(
    elements.namedItem("propertyValue(pgmFieldA002)") as HTMLInputElement,
    "1"
  );

  setValue(
    elements.namedItem("propertyValue(pgmFieldA005)") as HTMLInputElement,
    "0001100033"
  );

  setValue(
    elements.namedItem("propertyValue(pgmFieldD001)") as HTMLInputElement,
    "No Health Concerns"
  );

  // Start the observations with student's name
  [
    "propertyValue(pgmFieldD002)",
    "propertyValue(pgmFieldD003)",
    "propertyValue(pgmFieldD004)",
    "propertyValue(pgmFieldD005)"
  ].forEach(elementName => {
    setValue(
      elements.namedItem(elementName) as HTMLInputElement,
      student.firstName + " "
    )
  });
}

function setupFRCTrackerHooks(student: Student) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const recommendationElement = elements.namedItem("propertyValue(pgmFieldA006)") as HTMLSelectElement;
  const assessorSummaryLanguageAssessment = elements.namedItem("propertyValue(pgmFieldA011)") as HTMLInputElement;
  const englishProficiencyOral = elements.namedItem("propertyValue(pgmFieldA012)") as HTMLInputElement;
  const englishProficiencyReading = elements.namedItem("propertyValue(pgmFieldA013)") as HTMLInputElement;
  const englishProficiencyWriting = elements.namedItem("propertyValue(pgmFieldA014)") as HTMLInputElement;
  const englishProficiencyOverall = elements.namedItem("propertyValue(pgmFieldA015)") as HTMLInputElement;
  const assessorComments = elements.namedItem("propertyValue(pgmFieldD006)") as HTMLInputElement;
  const languageSupport = elements.namedItem("propertyValue(pgmFieldA016)") as HTMLInputElement;
  const recommendedSecondaryEnglishCourse = elements.namedItem("propertyValue(pgmFieldA017)") as HTMLInputElement;

  const updateAssessorComments = () => {
    setValue(
      assessorComments,
      FRCTrackerFields.assessorComments(
        student,
        parseInt(recommendationElement.value),
        englishProficiencyOral.value,
        englishProficiencyReading.value,
        englishProficiencyWriting.value
      )
    )
    assessorComments.dispatchEvent(new Event("keyup"));
  };

  recommendationElement.addEventListener("change", () => {
    const dropdownValue = parseInt(recommendationElement.value);

    setValue(
      assessorSummaryLanguageAssessment,
      (() => {
        switch (FRCTrackerFields.languageCategory(dropdownValue)) {
          case "native": return "1";
          case "ESL": return "2";
          case "ELD": return "3";
          case "unknown": return "";
        }
      })()
    );

    setValue(englishProficiencyOverall, FRCTrackerFields.overallCategory(dropdownValue));

    setValue(languageSupport, FRCTrackerFields.languageSupport(dropdownValue));

    setValue(
      recommendedSecondaryEnglishCourse,
      (() => {
        switch (FRCTrackerFields.secondaryEnglishCourse(dropdownValue)) {
          case "ELDAO": return "1";
          case "ELDBO": return "2";
          case "ELDCO": return "3";
          case "ELDDO": return "4";
          case "ELDEO": return "5";
          case "ESLAO": return "6";
          case "ESLBO": return "7";
          case "ESLCO": return "8";
          case "ESLDO": return "9";
          case "ESLEO": return "10";
          default: return "";
        }
      })()
    );

    updateAssessorComments();
  });

  [
    englishProficiencyOral,
    englishProficiencyReading,
    englishProficiencyWriting,
  ].forEach(element => {
    element.addEventListener("change", updateAssessorComments);
  });
}

function setupFRCTrackerTooltips() {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const hintStep = (num: number) => {
    return `<span style="color: chocolate;">Step ${num}</span>`;
  };

  // recommendation
  (elements.namedItem("propertyValue(pgmFieldA006)") as HTMLInputElement).insertAdjacentHTML("afterend", hintStep(1));

  // oral, reading, writing
  [
    elements.namedItem("propertyValue(pgmFieldA012)") as HTMLInputElement,
    elements.namedItem("propertyValue(pgmFieldA013)") as HTMLInputElement,
    elements.namedItem("propertyValue(pgmFieldA014)") as HTMLInputElement
  ].forEach(element => {
    element.insertAdjacentHTML("afterend", hintStep(2));
  });

  // assessor comments
  (elements.namedItem("propertyValue(pgmFieldD006)") as HTMLInputElement).insertAdjacentHTML("beforebegin", hintStep(3));
}

function fillEducationalBackground(student: Student) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const name = student.firstName;

  const schoolYear = elements.namedItem("propertyValue(pgmFieldB002)") as HTMLInputElement;
  setValue(schoolYear, EducationalBackgroundFields.schoolYear());

  setValue(
    elements.namedItem("propertyValue(pgmFieldA002)") as HTMLInputElement,
    "Yes"
  );

  setValue(
    elements.namedItem("propertyValue(pgmFieldD001)") as HTMLInputElement,
    `${name}'s favourite subject is mathematics, and ${name} wants to become a doctor in the future.`
  );
}

function setupEducationalBackgroundHooks(student: Student) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const grade = elements.namedItem("propertyValue(pgmFieldA001)") as HTMLSelectElement;
  const country = elements.namedItem("propertyValue(pgmFieldB001)") as HTMLSelectElement;
  const schoolYear = elements.namedItem("propertyValue(pgmFieldB002)") as HTMLInputElement;
  const comments = elements.namedItem("propertyValue(pgmFieldD002)") as HTMLInputElement;

  [grade, country, schoolYear].forEach(element => {
    element.addEventListener("change", () => {
      setValue(
        comments,
        EducationalBackgroundFields.comments(
          student,
          grade.value,
          country.selectedOptions[0].textContent || "",
          schoolYear.value
        )
      );
    });
  });
}

function setValue(element: HTMLInputElement | null, value: string) {
  if (!element) {
    return;
  }

  element.value = value;
  element.dispatchEvent(new Event("change"));
  element.style.backgroundColor = "yellow";
  element.style.borderColor = "green";
}
