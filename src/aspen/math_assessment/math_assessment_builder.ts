import { Student } from "../../common/models/person";
import { SecondaryMathAssessment } from "../../common/models/secondary_math_assessment";
import { SecondaryMathExams } from "../../common/models/secondary_math_exams";
import { SecondaryMathTasks } from "../../common/models/secondary_math_tasks";
import { FRCTrackerMathFields } from "../helpers/frc_tracker_math_fields";

export class MathAssessmentBuilder {
  static build(student: Student) {
    const assessment = student.secondaryMathAssessment!;
    return `
      <button type="button" class="btn-close mb-3" aria-label="Close" data-function="close-math-assessment"></button>

      <form>
        <h4>Secondary Math Assessment: ${student.fullName}</h4>
        ${this.buildConfigurationCard(assessment)}
        ${this.buildMathObservationsCard(student)}
      </form>
    `;
  }

  private static buildConfigurationCard(assessment: SecondaryMathAssessment) {
    return `
      <div class="card mb-4">
        <div class="card-header">Configuration</div>
        <div class="card-body mb-2">
          ${this.buildDiagnosticTasksRow(assessment.diagnosticTasks)}
          ${this.buildCourseCodeRow(assessment.courseCode)}
          ${this.buildGradingTableRow(assessment)}
          ${this.buildOutcomeRow(assessment.passed)}
        </div>
      </div>
    `;
  }

  private static buildDiagnosticTasksRow(tasks: string[]) {
    return `
      <div class="row align-items-center">
        <label for="diagnosticTasks" class="col-4 col-form-label">Diagnostic Tasks</label>
        <div class="col-8" id="diagnosticTasks">
          ${SecondaryMathTasks.diagnosticTasks.map((task) => {
            const id = `diagnostic${task}`;
            const value = `Diagnostic Task ${task}`;
            const checked = tasks.includes(value) ? "checked" : "";
            return `
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="${id}" name="diagnosticTask" value="${value}" ${checked}>
                <label class="form-check-label" for="${id}">${task}</label>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  private static buildCourseCodeRow(selectedCourseCode: string) {
    return `
      <div class="row mb-2">
        <div class="col-12 form-floating g-2">
          <select class="form-select" id="courseCode">
            ${ Object.entries(SecondaryMathExams).map(([courseCode, {gradeLevel}]) => {
              if (gradeLevel === 8) return "";
              const selected = courseCode === selectedCourseCode ? "selected" : "";
              return `<option value="${courseCode}" ${selected}>Grade ${gradeLevel}: ${courseCode}</option>`;
            }).join("")}
          </select>
          <label for="courseCode" class="col-form-label">Course</label>
        </div>
      </div>
    `;
  }

  private static buildGradingTableRow(assessment: SecondaryMathAssessment) {
    const topicsAndQuestions = SecondaryMathExams[assessment.courseCode].exams[0].topicsAndQuestions;

    return `
      <div class="row">
        <div class="col-12 g-2">
          <table id="gradingTable" class="table table-bordered text-center align-middle">
            <thead class="table-light">
              <tr>
                <th scope="col">Topic</th>
                <th scope="col">Questions</th>
                <th scope="col">Proficiency</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(topicsAndQuestions).map(([topic, questions], index) => {
                const pChecked = assessment.gradingTable["P"].includes(topic) ? "checked" : "";
                const sChecked = assessment.gradingTable["S"].includes(topic) ? "checked" : "";
                const lChecked = assessment.gradingTable["L"].includes(topic) ? "checked" : "";
                return `
                  <tr>
                    <td>${topic}</td>
                    <td>${questions.join(", ")}</td>
                    <td>
                      <input type="radio" class="btn-check" name="${topic}" id="topic${index}P" ${pChecked} autocomplete="off">
                      <label class="btn btn-outline-success" for="topic${index}P">P</label>

                      <input type="radio" class="btn-check" name="${topic}" id="topic${index}S" ${sChecked} autocomplete="off">
                      <label class="btn btn-outline-warning" for="topic${index}S">S</label>

                      <input type="radio" class="btn-check" name="${topic}" id="topic${index}L" ${lChecked} autocomplete="off">
                      <label class="btn btn-outline-danger" for="topic${index}L">L</label>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private static buildOutcomeRow(passed: boolean) {
    const passedSelected = passed ? "selected" : "";
    const failedSelected = passed ? "" : "selected";

    return `
      <div class="row">
        <div class="col-12 form-floating g-2">
          <select class="form-select" id="outcome">
            <option value="1" ${passedSelected}>Passed</option>
            <option value="0" ${failedSelected}>Failed</option>
          </select>
          <label for="outcome" class="col-form-label">Outcome</label>
        </div>
      </div>
    `;
  }

  private static buildMathObservationsCard(student: Student) {
    return `
      <div class="card">
        <div class="card-header">Math Observations</div>
        <div class="card-body">
          <p class="card-text">${FRCTrackerMathFields.mathObservations(student).replaceAll("\n", "<br>")}</p>
        </div>
      </div>
    `;
  }
}
