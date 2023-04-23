import { Student } from "../../common/models/person";
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
    `;
  }

  private static buildGradingTableRow() {
    return `
      <div class="row">
        <div class="col-12 g-2">
          <table class="table table-bordered mb-0 text-center">
            <caption>MCF3M</caption>
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
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="proficiencyTopic1" id="proficiencyTopic1P" value="P">
                    <label class="form-check-label" for="proficiencyTopic1P">P</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="proficiencyTopic1" id="proficiencyTopic1S" value="S">
                    <label class="form-check-label" for="proficiencyTopic1S">S</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="proficiencyTopic1" id="proficiencyTopic1L" value="L">
                    <label class="form-check-label" for="proficiencyTopic1L">L</label>
                  </div>
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
      <div class="row align-items-center">
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
