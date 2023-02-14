import { Family } from "../../common/models/family";
import { Parent, Student } from "../../common/models/person";

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
        const dateOfBirthAndCountryOfBirth = (infoArr.shift() || "");

        [student.dateOfBirth, student.countryOfBirth] = RawData.parseDateOfBirthAndCountryOfBirth(dateOfBirthAndCountryOfBirth);

        student.phone = this.phone;
        student.address = this.address;
        student.studentNotes = commonNotes.concat("\n", infoArr.join("\n"));
        family.students.push(student);
      }
    });

    return family;
  }

  // const tests = ["", "28/07/2005 / Turkey", "9/03/12 Cambodia", "June 2, 2008 Mogadishu", "26.06.2011 Turkey", "10/January/2003 Somalia", "21/06/08 /Afghanistan", "August 1st, 2006 /Turkey", "26-Jan-2006 Afghanistan", "03/07/2014", "08/09/2009 / Republic of South Africa", "my country", "country"]
  private static parseDateOfBirthAndCountryOfBirth(str: string): [string, string] {
    const arr = str.split("/").flatMap(n => n.split(" ")).filter(n => n.length > 0);
    if (arr.length == 0) {
      return ["", ""];
    }

    let ptr = arr.length - 1;
    while (ptr >= 0 && !/\d/.test(arr[ptr])) {
      ptr--;
    }
    const country = arr.slice(ptr + 1).join(" ");
    const dateOfBirthArr = arr.slice(0, ptr + 1);
    const dateOfBirth = dateOfBirthArr.every(n => /\d/.test(n)) ? dateOfBirthArr.join("/") : dateOfBirthArr.join(" ");

    return [dateOfBirth, country];
  }
}
