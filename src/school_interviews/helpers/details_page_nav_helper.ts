import { Family } from '../models/family';
import { Student } from '../models/person';

export class DetailsPageNavHelpers {
  static generate(family: Family) {
    const navItems = this.generateNavItems(family);
    const tabPanes = this.generateTabPanes(family);

    return `
      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        ${navItems}
      </ul>
      <div class="tab-content" id="pills-tabContent">
        ${tabPanes}
      </div>
    `;
  }

  private static generateNavItems(family: Family) {
    let parentIndex = 1;
    let studentIndex = 1;
    const listItems = family.people.map((person, index) => {
      const active = index === 0 ? "active" : "";
      const selected = index === 0 ? "true" : "false";
      const displayName = person instanceof Student ? `Student ${studentIndex++}` : `Parent ${parentIndex++}`;

      return `
        <li class="nav-item" role="presentation">
          <button class="nav-link ${active}" id="pills-person-${index}-tab" data-bs-toggle="pill" data-bs-target="#pills-person-${index}" type="button" role="tab" aria-controls="pills-person-${index}" aria-selected="${selected}">${displayName}</button>
        </li>
      `;
    });

    return listItems.join("");
  }

  private static generateTabPanes(family: Family) {
    let parentIndex = 1;
    let studentIndex = 1;
    const tabPanes = family.people.map((person, index) => {
      const active = index === 0 ? "show active" : "";
      const displayName = person instanceof Student ? `Student ${studentIndex++}` : `Parent ${parentIndex++}`;

      return `
        <div class="tab-pane fade ${active}" id="pills-person-${index}" role="tabpanel" aria-labelledby="pills-person-${index}-tab" tabindex="0">
          <form data-person-name="${displayName}" data-person-index="${index}">
            <div class="form-floating">
              <input type="text" class="form-control mb-2" name="name" placeholder="name" value="${person.name}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
              <label for="nameInput">Name</label>
            </div>

            <div class="form-floating">
              <input type="email" class="form-control mb-2" name="email" placeholder="email" value="${person.email}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
              <label for="emailInput">Email</label>
            </div>

            <div class="form-floating">
              <input type="tel" class="form-control mb-2" name="phone" placeholder="phone" value="${person.phone}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
              <label for="phoneInput">Phone</label>
            </div>

            <div class="form-floating">
              <input type="text" class="form-control mb-2" name="address" placeholder="address" value="${person.address}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
              <label for="addressInput">Address</label>
            </div>

            <div class="form-floating">
              <textarea class="form-control mb-2" name="extraNotes" placeholder="extra notes" style="max-width: 25em; height: auto;">${person.extraNotes}</textarea>
              <label for="extraNotesInput">Extra Notes</label>
            </div>

            ${person instanceof Student ? this.generateExtraStudentFields(person) : ""}
          </form>
        </div>
      `;
    });

    return tabPanes.join("");
  }

  static generateExtraStudentFields(student: Student) {
    return `
      <div class="form-floating">
        <input type="text" class="form-control mb-2" name="dateOfBirth" placeholder="date of birth" value="${student.dateOfBirth}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
        <label for="dateOfBirthInput">Date of Birth</label>
      </div>

      <div class="form-floating">
        <input type="text" class="form-control mb-2" name="countryOfBirth" placeholder="country of birth" value="${student.countryOfBirth}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
        <label for="countryOfBirthInput">Country of Birth</label>
      </div>

      <div class="form-floating">
        <textarea class="form-control" name="studentNotes" placeholder="student notes" style="max-width: 25em; height: auto;">${student.studentNotes}</textarea>
        <label for="studentNotesInput">Student Notes</label>
      </div>
    `;
  }
}
