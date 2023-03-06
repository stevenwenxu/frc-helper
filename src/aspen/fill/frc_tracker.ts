import { Student } from "../../common/models/person";
import { FRCTrackerFields } from "../helpers/frc_tracker_fields";
import { setValue } from "../fill";

export function fillFRCTracker(student: Student) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;

  setValue(
    elements.namedItem("propertyValue(pgmActionStart)") as HTMLInputElement,
    new Date().toDateString(),
    false
  );

  // File Status: Complete
  setValue(
    elements.namedItem("propertyValue(pgmFieldA002)") as HTMLInputElement,
    "1",
    false
  );

  setValue(
    elements.namedItem("propertyValue(pgmFieldA005)") as HTMLInputElement,
    "0001100033"
  );

  setValue(
    elements.namedItem("propertyValue(pgmFieldD001)") as HTMLInputElement,
    "No Health Concerns",
    false
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
      student.firstName + " ",
      false
    )
  });
}

export function setupFRCTrackerHooks(student: Student) {
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

export function setupFRCTrackerTooltips() {
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
