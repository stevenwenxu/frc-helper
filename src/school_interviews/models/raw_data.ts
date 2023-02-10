import { Family } from "./family";
import { Parent, Student } from "./person";

export class RawData {
  parentsName: string = "";
  email: string = "";
  phone: string = "";
  address: string = "";
  immigrationStatusFirstLanguage: string = "";
  notes: string = "";
  students: string[] = [];

  constructor(table: HTMLTableElement) {
    for (const row of Array.from(table.rows)) {
      if (row.cells.length != 2) {
        continue;
      }

      const key = row.cells[0].innerText.trim();
      const value = row.cells[1].innerText.trim();
      switch (key) {
        case "PARENT's Name":
          this.parentsName = value;
          break;
        case "Email":
          this.email = value;
          break;
        case "Phone":
          this.phone = value;
          break;
        case "Address":
          this.address = value;
          break;
        case "Immigration Status/ First Language":
          this.immigrationStatusFirstLanguage = value;
          break;
        case "Extra NOTES":
          this.notes = value;
          break;
        case "Students":
          this.students.push(value);
          break;
        default:
          console.log(`Unknown key: ${key}`);
          break;
      }
    }
  }

  parse(): Family {
    let family = new Family();
    const commonNotes = `${this.immigrationStatusFirstLanguage}\n${this.notes}`;

    this.parentsName.split("/")
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .forEach(parentName => {
        const parent = new Parent();
        parent.name = parentName;
        parent.phone = this.phone;
        parent.address = this.address;
        parent.email = this.email;
        parent.parentNotes = commonNotes;
        family.parents.push(parent);
    });

    this.students.forEach(studentInfo => {
      const infoArr = studentInfo.split("\n").map(s => s.trim()).filter(s => s.length > 0);
      if (infoArr.length > 0) {
        const student = new Student();
        student.name = infoArr.shift() || "";
        const dateOfBirthAndCountryOfBirth = (infoArr.shift() || "")
          .split("/")
          .map(s => s.trim())
          .filter(s => s.length > 0);

        switch (dateOfBirthAndCountryOfBirth.length) {
        case 0:
          break;
        case 1:
          student.dateOfBirth = dateOfBirthAndCountryOfBirth.pop() || "";
          break;
        default:
          student.countryOfBirth = dateOfBirthAndCountryOfBirth.pop() || "";
          student.dateOfBirth = dateOfBirthAndCountryOfBirth.join("/")
          break;
        }

        student.phone = this.phone;
        student.address = this.address;
        student.studentNotes = commonNotes.concat("\n", infoArr.join("\n"));
        family.students.push(student);
      }
    });

    return family;
  }
}
