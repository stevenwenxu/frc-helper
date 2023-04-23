import * as bootstrap from "bootstrap";
import { FamilyRepository } from "../../common/family_repository";
import { Student } from "../../common/models/person";
import { renderFamilyDetails } from "../popup";
import { MathAssessmentBuilder } from "./math_assessment_builder";

export function setupMathAssessmentButtons(familyId: string) {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".tab-pane button[data-function='mathAssessment'");
  for (const button of Array.from(buttons)) {
    button.addEventListener("click", async () => {
      const family = await FamilyRepository.getFamilyWithUniqueId(familyId);
      if (family) {
        const personIndex = parseInt(button.dataset.personIndex!);
        const student = family.people[personIndex] as Student;

        renderMathAssessment(student);
      }
    });
  }
}

function renderMathAssessment(student: Student) {
  const currentSelectedPersonId = document.querySelector(".nav-link.active")!.id;
  const familyDetails = document.getElementById("familyDetails")!;
  familyDetails.innerHTML = MathAssessmentBuilder.build(student);

  const closeBtn = document.querySelector<HTMLButtonElement>("button[data-function='close-math-assessment'");
  closeBtn?.addEventListener("click", async () => {
    await renderFamilyDetails();
    bootstrap.Tab.getOrCreateInstance(`#${currentSelectedPersonId}`).show();
  });
}
