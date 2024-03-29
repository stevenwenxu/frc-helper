import { Family } from '../../common/models/family';
import { Student, Parent, Person } from '../../common/models/person';
import { SchoolCategory } from '../../common/models/school_category';
import { StatusInCanada } from '../../common/models/status_in_canada';

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
    const personType = person instanceof Student ? "student" : "parent";
    const isOCDSB031Available = person instanceof Student && (
      person.statusInCanada === StatusInCanada.CanadianCitizen ||
      person.statusInCanada === StatusInCanada.PermanentResident
    );

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
          ${isOCDSB031Available ? `
          <button
            type="button"
            class="btn btn-outline-primary flex-fill"
            data-person-index="${personIndex}"
            data-family-id="${familyUniqueId}"
            data-function="download031"
          >
            <svg width="16" height="16" fill="currentColor">
              <use href="/images/download.svg#download-svg"/>
            </svg>
            OCDSB 031
          </button>
          ` : ""}
          <button
            type="button"
            class="btn btn-outline-primary flex-fill"
            data-person-index="${personIndex}"
            data-family-id="${familyUniqueId}"
            data-function="downloadStep"
          >
            <svg width="16" height="16" fill="currentColor">
              <use href="/images/download.svg#download-svg"/>
            </svg>
            STEP
          </button>
          <button
            type="button"
            class="btn btn-outline-primary flex-fill"
            data-person-index="${personIndex}"
            data-family-id="${familyUniqueId}"
            data-function="email"
          >
            Generate email
          </button>
        </div>
        ` : ""}
      </div>
    `;
  }
}
