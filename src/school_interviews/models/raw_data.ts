import { Person, Student } from "./person";

export class RawData {
  parentsName: string | null = null;
  email: string | null = null;
  phone: string | null = null;
  address: string | null = null;
  immigrationStatusFirstLanguage: string | null = null;
  notes: string | null = null;
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

        switch (dateOfBirthAndCountryOfBirth.length) {
        case 0:
          break;
        case 1:
          student.dateOfBirth = dateOfBirthAndCountryOfBirth.pop() || null;
          break;
        default:
          student.countryOfBirth = dateOfBirthAndCountryOfBirth.pop() || null;
          student.dateOfBirth = dateOfBirthAndCountryOfBirth.join("/")
          break;
        }

        student.studentNotes = infoArr.join("\n");
        students.push(student);
      }
    });

    const result = parents.concat(students);
    result.forEach(p => {
      p.email = this.email;
      p.phone = this.phone;
      p.address = this.address;
      p.extraNotes = `${this.immigrationStatusFirstLanguage}\n${this.notes}`;
    });

    return result;
  }
}
