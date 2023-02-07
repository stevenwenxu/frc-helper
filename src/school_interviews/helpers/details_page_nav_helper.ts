import { Person, Student } from '../models/person';

export class DetailsPageNavHelpers {
  static generate(persons: Person[]) {
    const navItems = this.generateNavItems(persons);
    const tabPanes = this.generateTabPanes(persons);

    return `
      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        ${navItems}
      </ul>
      <div class="tab-content" id="pills-tabContent">
        ${tabPanes}
      </div>
    `;
  }

  private static generateNavItems(persons: Person[]) {
    let parentIndex = 1;
    let studentIndex = 1;
    const listItems = persons.map((person, index) => {
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

  private static generateTabPanes(persons: Person[]) {
    const tabPanes = persons.map((person, index) => {
      const active = index === 0 ? "show active" : "";

      return `
        <div class="tab-pane fade ${active}" id="pills-person-${index}" role="tabpanel" aria-labelledby="pills-person-${index}-tab" tabindex="0">
          <form>
            <div class="form-floating">
              <input type="text" class="form-control mb-2" id="nameInput" placeholder="name" value="${person.name}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
              <label for="nameInput">Name</label>
            </div>

            <div class="form-floating">
              <input type="email" class="form-control mb-2" id="emailInput" placeholder="email" value="${person.email}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
              <label for="emailInput">Email</label>
            </div>

            <div class="form-floating">
              <input type="tel" class="form-control mb-2" id="phoneInput" placeholder="phone" value="${person.phone}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
              <label for="phoneInput">Phone</label>
            </div>

            <div class="form-floating">
              <input type="text" class="form-control mb-2" id="addressInput" placeholder="address" value="${person.address}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
              <label for="addressInput">Address</label>
            </div>

            ${person instanceof Student ? this.generateExtraStudentFields(person) : ""}

            <button type="submit" class="btn btn-primary">Update</button>
          </form>
        </div>
      `;
    });

    return tabPanes.join("");
  }

  static generateExtraStudentFields(student: Student) {
    return `
      <div class="form-floating">
        <input type="text" class="form-control mb-2" id="dateOfBirthInput" placeholder="date of birth" value="${student.dateOfBirth}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
        <label for="dateOfBirthInput">Date of Birth</label>
      </div>

      <div class="form-floating">
        <input type="text" class="form-control mb-2" id="countryOfBirthInput" placeholder="country of birth" value="${student.countryOfBirth}" style="background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);">
        <label for="countryOfBirthInput">Country of Birth</label>
      </div>

      <div class="form-floating">
        <textarea class="form-control" id="studentNotesInput" placeholder="student notes" style="max-width: 25em; height: auto;">${student.studentNotes}</textarea>
        <label for="studentNotesInput">Student Notes</label>
      </div>
    `;
  }
}
