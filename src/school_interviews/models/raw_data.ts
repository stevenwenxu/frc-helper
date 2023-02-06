import { Person, Student } from "./person";

export class RawData {
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
