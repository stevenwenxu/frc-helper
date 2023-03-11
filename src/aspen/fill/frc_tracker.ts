import { Student } from "../../common/models/person";
import { Family } from "../../common/models/family";
import { FamilyRepository } from "../../common/family_repository";
import { SchoolCategory } from "../../common/models/school_category";
import { FRCTrackerFields } from "../helpers/frc_tracker_fields";
import { setValue } from "../fill";
import { LanguageCategory } from "../../common/models/language_category";

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
    "0001100033",
    false
  );

  setValue(
    elements.namedItem("propertyValue(pgmFieldD001)") as HTMLInputElement,
    "No Health Concerns",
    false
  );

  // Oral communication: tasks
  setValue(
    elements.namedItem("propertyValue(pgmFieldD022)") as HTMLInputElement,
    "Oral Interview\nStudent Portfolio",
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

export function setupFRCTrackerHooks(familyId: string, personIndex: number) {
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

  const updateAssessorComments = async () => {
    const family = await FamilyRepository.getFamilyWithUniqueId(familyId);
    if (!family) { return; }
    const student = family.people[personIndex] as Student;
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

  recommendationElement.addEventListener("change", async () => {
    const dropdownValue = parseInt(recommendationElement.value);

    setValue(
      assessorSummaryLanguageAssessment,
      (() => {
        switch (FRCTrackerFields.languageCategory(dropdownValue)) {
          case LanguageCategory.Native: return "1";
          case LanguageCategory.ESL: return "2";
          case LanguageCategory.ELD: return "3";
          case LanguageCategory.Unknown: return "";
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

    await updateAssessorComments();
  });

  [
    englishProficiencyOral,
    englishProficiencyReading,
    englishProficiencyWriting,
  ].forEach(element => {
    element.addEventListener("change", updateAssessorComments);
  });

  [
    assessorComments,
    assessorSummaryLanguageAssessment,
    englishProficiencyOverall
  ].forEach(element => {
    element.addEventListener("change", async () => {
      await saveFRCTrackerDetails(familyId, personIndex);
    });
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

export async function saveFRCTrackerDetails(familyId: string, personIndex: number) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const recommendationElement = elements.namedItem("propertyValue(pgmFieldA006)") as HTMLSelectElement;
  const assessorComments = elements.namedItem("propertyValue(pgmFieldD006)") as HTMLInputElement;
  const englishProficiencyOral = elements.namedItem("propertyValue(pgmFieldA012)") as HTMLInputElement;
  const englishProficiencyReading = elements.namedItem("propertyValue(pgmFieldA013)") as HTMLInputElement;
  const englishProficiencyWriting = elements.namedItem("propertyValue(pgmFieldA014)") as HTMLInputElement;
  const englishProficiencyOverall = elements.namedItem("propertyValue(pgmFieldA015)") as HTMLInputElement;

  const dropdownValue = parseInt(recommendationElement.value);

  await FamilyRepository.updateStudent(familyId, personIndex, student => {
    student.schoolCategory = FRCTrackerFields.schoolCategory(dropdownValue);
    student.languageCategory = FRCTrackerFields.languageCategory(dropdownValue);
    student.listeningStep = englishProficiencyOral.value;
    student.speakingStep = englishProficiencyOral.value;
    student.readingStep = englishProficiencyReading.value;
    student.writingStep = englishProficiencyWriting.value;
    student.overallStep = englishProficiencyOverall.value;

    if (student.schoolCategory == SchoolCategory.Secondary) {
      student.secondaryCourseRecommendations = [
        FRCTrackerFields.secondaryEnglishCourse(dropdownValue),
        assessorComments.value.match(/\bM[A-Z][A-Z][0-9][A-Z]\b/)?.[0] || ""
      ].filter(str => str.length > 0).join(", ");
    } else {
      student.secondaryCourseRecommendations = "";
    }

    return student;
  });
}
