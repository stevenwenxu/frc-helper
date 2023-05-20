import { FamilyRepository } from "../../common/family_repository";
import { schoolCategoryFromGrade } from "../../common/models/school_category";
import { reRender } from "../popup";

export function setupSetGradeDropdowns(familyId: string) {
  const setGradeDropdowns = document.querySelectorAll<HTMLSelectElement>(".tab-pane select[data-function='setGrade'");
  for (const setGradeElement of Array.from(setGradeDropdowns)) {
    setGradeElement.addEventListener("change", async () => {
      const personIndex = parseInt(setGradeElement.dataset.personIndex!);
      await FamilyRepository.updateStudent(familyId, personIndex, (student) => {
        student.grade = setGradeElement.value;
        student.schoolCategory = schoolCategoryFromGrade(student.grade);
        student.secondaryMathAssessment = null;
        student.secondaryCourseRecommendations = "";
        student.isGradeManuallySet = student.grade !== "";
        return Promise.resolve(student);
      });
      await reRender();
    });
  }
}
