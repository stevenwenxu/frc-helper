import { Family } from '../models/family';
import { Student, Parent, Person } from '../models/person';

export class DetailsPageNavHelpers {
  static generate(family: Family) {
    const navItems = this.generateNavItems(family);
    const tabPanes = this.generateTabPanes(family);

    return `
      <ul class="nav nav-tabs mb-3" role="tablist">
        ${navItems}
      </ul>
      <div class="tab-content">
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
          <button class="nav-link ${active}" id="person-${index}-tab" data-bs-toggle="tab" data-bs-target="#person-${index}" type="button" role="tab" aria-controls="person-${index}" aria-selected="${selected}">${displayName}</button>
        </li>
      `;
    });

    listItems.push(`
      <li class="nav-item dropdown">
        <button class="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          New from...
        </button>
        ${this.addNewPersonMenu(family)}
      </li>
    `);

    return listItems.join("");
  }

  private static generateTabPanes(family: Family) {
    let parentIndex = 1;
    let studentIndex = 1;

    const tabPanes = family.people.map((person, index) => {
      const displayName = person instanceof Student ? `Student ${studentIndex++}` : `Parent ${parentIndex++}`;

      return this.tabPaneForPerson(person, index, displayName);
    });

    return tabPanes.join("");
  }

  private static tabPaneForPerson(person: Person, personIndex: number, displayName: string) {
    const active = personIndex === 0 ? "show active" : "";
    const inputStyle = "background-color: var(--bs-form-control-bg); border:var(--bs-border-width) solid var(--bs-border-color);";
    const textAreaStyle = "max-width: 25em; height: 120px;";

    return `
      <div class="tab-pane fade ${active}" id="person-${personIndex}" role="tabpanel" aria-labelledby="person-${personIndex}-tab" tabindex="0">
        <form data-person-name="${displayName}" data-person-index="${personIndex}">
          <div class="form-floating">
            <input type="text" class="form-control mb-2" name="firstName" placeholder="firstName" value="${person.firstName}" style="${inputStyle}">
            <label for="firstNameInput">First Name</label>
          </div>

          <div class="form-floating">
            <input type="text" class="form-control mb-2" name="middleName" placeholder="middleName" value="${person.middleName}" style="${inputStyle}">
            <label for="middleNameInput">Middle Name</label>
          </div>

          <div class="form-floating">
            <input type="text" class="form-control mb-2" name="lastName" placeholder="lastName" value="${person.lastName}" style="${inputStyle}">
            <label for="lastNameInput">Last Name</label>
          </div>

          ${person instanceof Parent ? `
          <div class="form-floating">
            <input type="email" class="form-control mb-2" name="email" placeholder="email" value="${person.email}" style="${inputStyle}">
            <label for="emailInput">Email</label>
          </div>
          ` : ""}

          <div class="form-floating">
            <input type="tel" class="form-control mb-2" name="phone" placeholder="phone" value="${person.phone}" style="${inputStyle}">
            <label for="phoneInput">Phone</label>
          </div>

          <div class="form-floating">
            <input type="text" class="form-control mb-2" name="address" placeholder="address" value="${person.address}" style="${inputStyle}">
            <label for="addressInput">Address</label>
          </div>

          ${person instanceof Parent ? `
          <div class="form-floating">
            <textarea class="form-control mb-2" name="parentNotes" placeholder="parent notes" style="${textAreaStyle}">${person.parentNotes}</textarea>
            <label for="parentNotesInput">Parent Notes</label>
          </div>
          ` : ""}

          ${person instanceof Student ? `
          <div class="form-floating">
            <input type="text" class="form-control mb-2" name="dateOfBirth" placeholder="date of birth" value="${person.dateOfBirth}" style="${inputStyle}">
            <label for="dateOfBirthInput">Date of Birth</label>
          </div>

          <div class="form-floating">
            <input type="text" class="form-control mb-2" name="countryOfBirth" placeholder="country of birth" value="${person.countryOfBirth}" style="${inputStyle}">
            <label for="countryOfBirthInput">Country of Birth</label>
          </div>

          <div class="form-floating">
            <textarea class="form-control mb-2" name="studentNotes" placeholder="student notes" style="${textAreaStyle}">${person.studentNotes}</textarea>
            <label for="studentNotesInput">Student Notes</label>
          </div>
          ` : ""}

        </form>
      </div>
    `;
  }

  static addNewPersonMenu(family: Family) {
    let parentIndex = 1;
    let studentIndex = 1;

    const options = family.people.map((person, index) => {
      const displayName = person instanceof Student ? `Student ${studentIndex++}` : `Parent ${parentIndex++}`;

      return `<li><button class="dropdown-item" type="button" data-person-index="${index}">${displayName}</button></li>`;
    }).join("");

    return `
      <ul class="dropdown-menu" id="newPersonDropdown">
        ${options}
      </ul>
    `;
  }
}
