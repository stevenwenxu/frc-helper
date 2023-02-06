class Person {
  name: string | null = null;
  email: string | null = null;
  phone: string | null = null;
  address: string | null = null;
  // immigrationStatus: string | null = null;
  // doa: string | null = null;
}

class Student extends Person {
  dateOfBirth: string | null = null;
  countryOfBirth: string | null = null;
  studentNotes: string | null = null;
}

class RawData {
  parentsName: string | null = null;
  email: string | null = null;
  phone: string | null = null;
  address: string | null = null;
  immigrationStatusFirstLanguage: string | null = null;
  notes: string | null = null;
  students: string[] = [];

  parse(): Person[] {
    const parents: Person[] = [];
    const students: Student[] = [];

    this.parentsName?.split("/")
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .forEach(parentName => {
        const parent = new Person();
        parent.name = parentName;
        parents.push(parent);
    });

    this.students.forEach(studentInfo => {
      const infoArr = studentInfo.split("\n").map(s => s.trim()).filter(s => s.length > 0);
      if (infoArr.length > 0) {
        const student = new Student();
        student.name = infoArr.shift() || null;
        const dateOfBirthAndCountryOfBirth = (infoArr.shift() || "")
          .split("/")
          .map(s => s.trim())
          .filter(s => s.length > 0);

        student.dateOfBirth = dateOfBirthAndCountryOfBirth.shift() || null;
        student.countryOfBirth = dateOfBirthAndCountryOfBirth.shift() || null;
        student.studentNotes = infoArr.join("\n");
        students.push(student);
      }
    });

    const result = parents.concat(students);
    result.forEach(p => {
      p.email = this.email;
      p.phone = this.phone;
      p.address = this.address;
    });

    return result;
  }
}

function extractData(table: HTMLTableElement) {
  let result = new RawData();

  for (const row of Array.from(table.rows)) {
    if (row.cells.length != 2) {
      continue;
    }

    const key = row.cells[0].innerText.trim();
    const value = row.cells[1].innerText.trim();
    switch (key) {
      case "PARENT's Name":
        result.parentsName = value;
        break;
      case "Email":
        result.email = value;
        break;
      case "Phone":
        result.phone = value;
        break;
      case "Address":
        result.address = value;
        break;
      case "Immigration Status/ First Language":
        result.immigrationStatusFirstLanguage = value;
        break;
      case "Extra NOTES":
        result.notes = value;
        break;
      case "Students":
        result.students.push(value);
        break;
    }
  }

  return result;
}

function insertButton(table: HTMLTableElement) {
  // if family exists, view family
  // otherwise, add new family
  fetch(chrome.runtime.getURL('/html/add_new_family.html')).then(r => r.text()).then(html => {
    table.insertAdjacentHTML('beforebegin', html);

    const container = document.getElementsByClassName("offcanvas-body")[0];
    fillContainer(container, table);
  });
}

function fillContainer(container: Element, table: HTMLTableElement) {
  const people = extractData(table).parse();
  console.log(people);
}

const table: HTMLTableElement | null = document.querySelector("#container > div > section > table");
if (table) {
  insertButton(table);
}
