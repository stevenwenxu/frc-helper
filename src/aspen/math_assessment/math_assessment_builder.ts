import { Student } from "../../common/models/person";
import { SecondaryMathExams } from "../../common/models/secondary_math_exams";
import { SecondaryMathTasks } from "../../common/models/secondary_math_tasks";

export class MathAssessmentBuilder {
  static build(student: Student) {
    return `
      <button type="button" class="btn-close mb-3" aria-label="Close" data-function="close-math-assessment"></button>

      <form>
        <h4>Secondary Math Assessment: ${student.fullName}</h4>
        ${this.buildConfigurationCard()}
        ${this.buildMathObservationsCard()}
      </form>
    `;
  }

  private static buildConfigurationCard() {
    return `
      <div class="card mb-4">
        <div class="card-header">Configuration</div>
        <div class="card-body mb-2">
          ${this.buildDiagnosticTasksRow()}
          ${this.buildAssessmentTasksRow()}
          ${this.buildGradingTableRow()}
          ${this.buildOutcomeRow()}
        </div>
      </div>
    `;
  }

  private static buildDiagnosticTasksRow() {
    return `
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
    `;
  }

  private static buildAssessmentTasksRow() {
    return `
      <div class="row mb-2">
        <div class="col-sm-6 form-floating g-2">
          <select class="form-select" id="assessmentLevel">
            ${Object.entries(SecondaryMathTasks.assessment).map(([gradeLevel, assessment]) => {
              return `<option value="${gradeLevel}">${assessment}</option>`;
            }).join("")}
          </select>
          <label for="assessmentLevel" class="col-form-label">Assessment Level</label>
        </div>
        <div class="col-sm-6 form-floating g-2">
          <select class="form-select" id="courseCode">
            ${Object.keys(SecondaryMathExams["11"]).map((courseCode) => {
              return `<option value="${courseCode}">${courseCode}</option>`;
            }).join("")}
          </select>
          <label for="courseCode" class="col-form-label">Course</label>
        </div>
      </div>
    `;
  }

  private static buildGradingTableRow() {
    return `
      <div class="row">
        <div class="col-12 g-2">
          <table class="table table-bordered text-center align-middle">
            <thead class="table-light">
              <tr>
                <th scope="col">Topic</th>
                <th scope="col">Questions</th>
                <th scope="col">Proficiency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Algebra</th>
                <td>15</td>
                <td>
                  <input type="radio" class="btn-check" name="proficiencyTopic1" id="proficiencyTopic1P" autocomplete="off">
                  <label class="btn btn-outline-success" for="proficiencyTopic1P">Proficient</label>

                  <input type="radio" class="btn-check" name="proficiencyTopic1" id="proficiencyTopic1S" autocomplete="off">
                  <label class="btn btn-outline-warning" for="proficiencyTopic1S">Somewhat</label>

                  <input type="radio" class="btn-check" name="proficiencyTopic1" id="proficiencyTopic1L" autocomplete="off">
                  <label class="btn btn-outline-danger" for="proficiencyTopic1L">Lacking</label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private static buildOutcomeRow() {
    return `
      <div class="row">
        <div class="col-12 form-floating g-2">
          <select class="form-select" id="outcome">
            <option value="1">Passed</option>
            <option value="0">Failed</option>
          </select>
          <label for="outcome" class="col-form-label">Outcome</label>
        </div>
      </div>
    `;
  }

  private static buildMathObservationsCard() {
    return `
      <div class="card">
        <div class="card-header">Math Observations</div>
        <div class="card-body">
          <p class="card-text">What a great student!</p>
        </div>
      </div>
    `;
  }
}
