import { Student } from "../../common/models/person";
import { SecondaryMathTasks } from "../../common/models/secondary_math_tasks";

export class MathAssessmentBuilder {
  static build(student: Student) {
    return `
      <button type="button" class="btn-close mb-3" aria-label="Close" data-function="close-math-assessment"></button>

      <form>
        <h4>Secondary Math Assessment: ${student.fullName}</h4>

        <div class="card mb-4">
          <div class="card-header">Configuration</div>
          <div class="card-body mb-2">
            <div class="row align-items-center">
              <label for="diagnosticTasks" class="col-4 col-form-label">Diagnostic Tasks</label>
              <div class="col-8" id="diagnosticTasks">
                ${SecondaryMathTasks.diagnosticTasks.map((task) => {
                  const id = `diagnostic${task}`;
                  return `
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="checkbox" id="${id}" value="${id}">
                      <label class="form-check-label" for="${id}">${task}</label>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>

            <div class="row align-items-center mb-2">
              <div class="col-sm-6 form-floating g-2">
                <select class="form-select" id="assessmentLevel">
                  ${Object.entries(SecondaryMathTasks.assessment).map(([gradeLevel, assessment]) => {
                    return `<option value="${gradeLevel}">${assessment}</option>`;
                  }).join("")}
                </select>
                <label for="assessmentLevel" class="col-form-label">Assessment Level</label>
              </div>
              <div class="col-sm-6 form-floating g-2">
                <select class="form-select" id="school">
                  <option value="university">University</option>
                  <option value="college">College</option>
                </select>
                <label for="school" class="col-form-label">Target school</label>
              </div>
            </div>

            <div class="row align-items-center">
              <div class="col-12 form-floating g-2">
                <select class="form-select" id="outcome">
                  <option value="1">Passed</option>
                  <option value="0">Failed</option>
                </select>
                <label for="outcome" class="col-form-label">Outcome</label>
              </div>
            </div>

          </div>
        </div>

        <div class="card">
          <div class="card-header">Math Observations</div>
          <div class="card-body">
            <p class="card-text">What a great student!</p>
          </div>
        </div>

      </form>
    `;
  }
}
