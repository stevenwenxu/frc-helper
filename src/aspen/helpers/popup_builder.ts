import { Family } from '../../common/models/family';
import { Student, Parent, Person } from '../../common/models/person';

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
        innerHTML += `<option value=${family.uniqueId}>${family.studentsNames}</option>`;
      }
      innerHTML += `</optgroup>`;
    }

    return innerHTML;
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

    return `
      <div class="tab-pane fade ${active}" id="person-${personIndex}" role="tabpanel" aria-labelledby="person-${personIndex}-tab" tabindex="0">
        <div class="d-grid gap-2 mb-3">
          <button type="button" class="btn btn-outline-primary" data-person-index="${personIndex}" data-family-id="${familyUniqueId}">Fill</button>
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
      </div>
    `;
  }
}
