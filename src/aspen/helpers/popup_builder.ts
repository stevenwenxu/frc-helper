import { Family } from '../../common/models/family';
import { Student, Parent, Person } from '../../common/models/person';
import { SchoolCategory } from '../../common/models/school_category';

export class PopupBuilder {
  static generate(family: Family) {
    return `
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs" role="tablist">
            ${this.generateNavItems(family)}
          </ul>
        </div>
        <div class="card-body">
          <div class="tab-content">
            ${this.generateTabPanes(family)}
          </div>
        </div>
      </div>
    `;
  }

  static buildFamilyPicker(families: Family[]) {
    let innerHTML = "";

    families.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());

    // group families by visit date
    const familiesByVisitDate = families.reduce((acc, family) => {
      const visitDate = family.visitDate.toDateString();
      if (acc[visitDate]) {
        acc[visitDate].push(family);
      } else {
        acc[visitDate] = [family];
      }
      return acc;
    }, {} as { [visitDate: string]: Family[] });

    for (const visitDate of Object.keys(familiesByVisitDate)) {
      innerHTML += `<optgroup label="${visitDate}">`;
      for (const family of familiesByVisitDate[visitDate]) {
        innerHTML += `<option value=${family.uniqueId}>${family.displayName}</option>`;
      }
      innerHTML += `</optgroup>`;
    }

    return innerHTML;
  }

  static buildEmptyState() {
    return `
      <div class="alert alert-primary mt-4" role="alert">
        <h4 class="alert-heading">No families here</h4>
        <hr>
        <p>You finished all your work today! 🎉</p>
        <p class="mb-0">If not yet, load families from <a target="_blank" class="alert-link" href="https://www.schoolinterviews.com.au/">School Interviews</a>, and then <a class="alert-link" href="">reload this page</a>.</p>
      </div>
    `;
  }

  private static generateNavItems(family: Family) {
    let parentIndex = 1;

    const listItems = family.people.map((person, index) => {
      const active = index === 0 ? "active" : "";
      const selected = index === 0 ? "true" : "false";
      const displayName = person instanceof Student ? person.firstNameWithGrade : `Parent ${parentIndex++}`;

      return `
        <li class="nav-item" role="presentation">
          <button class="nav-link ${active}" id="person-${index}-tab" data-bs-toggle="tab" data-bs-target="#person-${index}" type="button" role="tab" aria-controls="person-${index}" aria-selected="${selected}">${displayName}</button>
        </li>
      `;
    });

    return listItems.join("");
  }

  private static generateTabPanes(family: Family) {
    const tabPanes = family.people.map((person, index) => {
      return this.tabPaneForPerson(person, index, family.uniqueId);
    });

    return tabPanes.join("");
  }

  private static tabPaneForPerson(person: Person, personIndex: number, familyUniqueId: string) {
    const active = personIndex === 0 ? "show active" : "";
    const isSecondaryStudent = person instanceof Student && person.schoolCategory === SchoolCategory.Secondary;
    const allGrades = ["JK", "SK"].concat([...Array(12).keys()].map(i => `${i + 1}`));
    const personType = person instanceof Student ? "student" : "parent";

    return `
      <div class="tab-pane fade ${active}" id="person-${personIndex}" role="tabpanel" aria-labelledby="person-${personIndex}-tab" tabindex="0">
        <div class="d-flex gap-3 mb-3">
          <button
            type="button"
            class="btn btn-outline-primary flex-fill"
            data-person-index="${personIndex}"
            data-family-id="${familyUniqueId}"
            data-person-type="${personType}"
            data-function="fill"
          >
            Fill
          </button>
          ${isSecondaryStudent ? `
          <button
            type="button"
            class="btn btn-outline-secondary flex-fill"
            data-person-index="${personIndex}"
            data-family-id="${familyUniqueId}"
            data-function="mathAssessment"
          >
            Math Assessment
          </button>
          ` : ""}
        </div>
        <table class="table">
          <tbody>
            <tr>
              <th scope="row">First Name</th>
              <td>${person.firstName}</td>
            </tr>
            <tr>
              <th scope="row">Middle Name</th>
              <td>${person.middleName}</td>
            </tr>
            <tr>
              <th scope="row">Last Name</th>
              <td>${person.lastName}</td>
            </tr>

            ${person instanceof Student ? `
            <tr>
              <th scope="row">
                Grade
                ${person.isGradeManuallySet ? `
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-fill" viewBox="0 0 16 16">
                    <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z"/>
                  </svg>
                ` : ""}
              </th>
              <td>
                <div class="row gx-3 align-items-center">
                  <div class="col">
                    <select class="form-select" name="grade" data-person-index="${personIndex}" data-family-id="${familyUniqueId}" data-function="setGrade">
                      <option value="">Fill or select</option>
                      ${ allGrades.map(grade => `
                        <option value="${grade}" ${grade === person.grade ? "selected" : ""}>${grade}</option>
                      `).join("") }
                    </select>
                  </div>

                  <div class="col-auto">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="newSchoolYear${personIndex}"
                        data-person-index="${personIndex}"
                        data-family-id="${familyUniqueId}"
                        data-function="setIsGradeForNewSchoolYear"
                        ${person.isGradeForNewSchoolYear ? "checked" : ""}
                      >
                      <label class="form-check-label" for="newSchoolYear${personIndex}">New school year</label>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            ` : ""}

            ${person instanceof Parent ? `
            <tr>
              <th scope="row">Email</th>
              <td>${person.email}</td>
            </tr>
            ` : ""}

            <tr>
              <th scope="row">Phone</th>
              <td>${person.phone}</td>
            </tr>
            <tr>
              <th scope="row">Address</th>
              <td>${person.address}</td>
            </tr>

            ${person instanceof Parent ? `
            <tr>
              <th scope="row">Parent notes</th>
              <td>${person.parentNotes.replaceAll("\n", "<br>")}</td>
            </tr>
            ` : ""}

            ${person instanceof Student ? `
            <tr>
              <th scope="row">Date of birth</th>
              <td>${person.dateOfBirth}</td>
            </tr>
            <tr>
              <th scope="row">Country of birth</th>
              <td>${person.countryOfBirth}</td>
            </tr>
            <tr>
              <th scope="row">Student notes</th>
              <td>${person.studentNotes.replaceAll("\n", "<br>")}</td>
            </tr>
            ` : ""}
          </tbody>
        </table>

        ${person instanceof Student ? `
        <div class="d-flex gap-3 mb-3">
          <button type="button" class="btn btn-outline-primary flex-fill" data-person-index="${personIndex}" data-family-id="${familyUniqueId}" data-function="downloadStep">Download STEP</button>
          <button type="button" class="btn btn-outline-secondary flex-fill" data-person-index="${personIndex}" data-family-id="${familyUniqueId}" data-function="email">Generate email</button>
        </div>
        ` : ""}
      </div>
    `;
  }
}
