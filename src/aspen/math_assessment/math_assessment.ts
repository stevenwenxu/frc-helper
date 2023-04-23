import * as bootstrap from "bootstrap";
import { FamilyRepository } from "../../common/family_repository";
import { Student } from "../../common/models/person";
import { renderFamilyDetails } from "../popup";
import { MathAssessmentBuilder } from "./math_assessment_builder";
import { Family } from "../../common/models/family";
import { SecondaryMathAssessment, SecondaryMathAssessmentGrade, SecondaryMathExamLevel } from "../../common/models/secondary_math_assessment";
import { SecondaryMathExams } from "../../common/models/secondary_math_exams";

export function setupMathAssessmentButtons(familyId: string) {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".tab-pane button[data-function='mathAssessment'");
  for (const button of Array.from(buttons)) {
    button.addEventListener("click", async () => {
      let family = await FamilyRepository.getFamilyWithUniqueId(familyId);
      if (family) {
        const personIndex = parseInt(button.dataset.personIndex!);

        // If student needs to be set up, set it up and refresh the family object.
        if (await setupStudentIfNecessary(family, personIndex)) {
          family = await FamilyRepository.getFamilyWithUniqueId(familyId);
        }
        renderMathAssessment(family!, personIndex);
      }
    });
  }
}

// Returns true if the student was updated, false otherwise.
async function setupStudentIfNecessary(family: Family, personIndex: number) {
  const student = family.people[personIndex] as Student;
  let assessment = student.secondaryMathAssessment;
  if (assessment) {
    return false;
  } else {
    const defaultLevel = student.grade as SecondaryMathExamLevel;
    const [defaultCourseCode, _] = Object.entries(SecondaryMathExams[defaultLevel])[0];
    assessment = new SecondaryMathAssessment(defaultCourseCode);
    await updateStudentAssessment(family.uniqueId, personIndex, assessment);
    return true;
  }
}

async function updateStudentAssessment(familyId: string, personIndex: number, assessment: SecondaryMathAssessment) {
  await FamilyRepository.updateStudent(familyId, personIndex, (student) => {
    student.secondaryMathAssessment = assessment;
    return Promise.resolve(student);
  });
}

// Note: Ensure `family` is up to date.
function renderMathAssessment(family: Family, personIndex: number) {
  // TODO: extract to global constant, then import it
  const currentSelectedPersonTabId = document.querySelector(".nav-link.active")!.id;
  const familyDetails = document.getElementById("familyDetails")!;
  const student = family.people[personIndex] as Student;
  familyDetails.innerHTML = MathAssessmentBuilder.build(student);

  setupCloseButton(currentSelectedPersonTabId);
  setupForm(family, personIndex);
}

function setupCloseButton(currentSelectedPersonTabId: string) {
  const closeBtn = document.querySelector<HTMLButtonElement>("button[data-function='close-math-assessment'");
  closeBtn?.addEventListener("click", async () => {
    await renderFamilyDetails();
    bootstrap.Tab.getOrCreateInstance(`#${currentSelectedPersonTabId}`).show();
  });
}

function setupForm(family: Family, personIndex: number) {
  const student = family.people[personIndex] as Student;
  const assessment = student.secondaryMathAssessment!;

  setupDiagnosticTasks(family.uniqueId, personIndex, assessment);
  setupCourseCode(family.uniqueId, personIndex, assessment);
  setupGradingTable(family.uniqueId, personIndex, assessment);
  setupOutcome(family.uniqueId, personIndex, assessment);
}

function setupDiagnosticTasks(familyId: string, personIndex: number, assessment: SecondaryMathAssessment) {
  const diagnosticTasks = document.querySelectorAll<HTMLInputElement>("input[name='diagnosticTask']");
  for (const diagnosticTask of Array.from(diagnosticTasks)) {
    diagnosticTask.addEventListener("change", async () => {
      const value = diagnosticTask.value;
      if (diagnosticTask.checked) {
        assessment.diagnosticTasks.push(value);
      } else {
        const index = assessment.diagnosticTasks.indexOf(value);
        assessment.diagnosticTasks.splice(index, 1);
      }
      assessment.diagnosticTasks.sort();

      await updateStudentAssessment(familyId, personIndex, assessment);
    });
  }
}

function setupCourseCode(familyId: string, personIndex: number, assessment: SecondaryMathAssessment) {
  const courseCode = document.getElementById("courseCode") as HTMLSelectElement;
  courseCode.addEventListener("change", async () => {
    assessment.courseCode = courseCode.value;

    await updateStudentAssessment(familyId, personIndex, assessment);

    // TODO: rerender form
  });
}

function setupGradingTable(familyId: string, personIndex: number, assessment: SecondaryMathAssessment) {
  const table = document.getElementById("gradingTable") as HTMLTableElement;
  const radios = table.querySelectorAll<HTMLInputElement>("input[type='radio']");
  for (const radio of Array.from(radios)) {
    radio.addEventListener("change", async () => {
      const value = radio.labels![0].textContent as SecondaryMathAssessmentGrade;

      // Remove topic from old grades.
      SecondaryMathAssessmentGrade.forEach((grade) => {
        const index = assessment.gradingTable[grade].indexOf(radio.name);
        if (index > -1) {
          assessment.gradingTable[grade].splice(index, 1);
        }
      });
      // Add topic to the new grade.
      assessment.gradingTable[value].push(radio.name);

      await updateStudentAssessment(familyId, personIndex, assessment);
    });
  }
}

function setupOutcome(familyId: string, personIndex: number, assessment: SecondaryMathAssessment) {
  const outcome = document.getElementById("outcome") as HTMLSelectElement;
  outcome.addEventListener("change", async () => {
    assessment.passed = outcome.value === "1";

    await updateStudentAssessment(familyId, personIndex, assessment);
  });
}
