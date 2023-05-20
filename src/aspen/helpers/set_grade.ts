import { FamilyRepository } from "../../common/family_repository";
import { reRender } from "../popup";

export function setupGradeActions(familyId: string) {
  setupSetGradeDropdowns(familyId);
  setupIsNewSchoolYear(familyId);
}

function setupSetGradeDropdowns(familyId: string) {
  const setGradeDropdowns = document.querySelectorAll<HTMLSelectElement>(".tab-pane select[data-function='setGrade'");
  for (const setGradeElement of Array.from(setGradeDropdowns)) {
    setGradeElement.addEventListener("change", async () => {
      const personIndex = parseInt(setGradeElement.dataset.personIndex!);
      await FamilyRepository.updateStudent(familyId, personIndex, (student) => {
        student.grade = setGradeElement.value;
        student.secondaryMathAssessment = null;
        student.secondaryCourseRecommendations = "";
        student.isGradeManuallySet = student.grade !== "";
        return Promise.resolve(student);
      });
      await reRender();
    });
  }
}

function setupIsNewSchoolYear(familyId: string) {
  const newSchoolYearCheckBoxes = document.querySelectorAll<HTMLInputElement>(".tab-pane input[data-function='setIsGradeForNewSchoolYear'");
  for (const newSchoolYearCheckbox of Array.from(newSchoolYearCheckBoxes)) {
    newSchoolYearCheckbox.addEventListener("change", async () => {
      const personIndex = parseInt(newSchoolYearCheckbox.dataset.personIndex!);
      await FamilyRepository.updateStudent(familyId, personIndex, (student) => {
        student.isGradeForNewSchoolYear = newSchoolYearCheckbox.checked;
        return Promise.resolve(student);
      });
    });
  }
}
