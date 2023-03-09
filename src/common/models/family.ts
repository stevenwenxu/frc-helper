import { Parent, Student } from "./person";

export class Family {
  parents: Parent[] = [];
  students: Student[] = [];
  private _visitDate: string = "";

  // this is the number in the URL, e.g. /parents/4936708732223488/details
  uniqueId: string = "";

  get people() {
    return [...this.students, ...this.parents];
  }

  get studentsNames() {
    return this.students.map(student => `${student.firstName} ${student.lastName}`).join(" / ");
  }

  get visitDate(): Date {
    return new Date(this._visitDate);
  }

  set visitDate(visitDate: Date) {
    this._visitDate = visitDate.toJSON();
  }

  withUniqueId(uniqueId: string): Family {
    this.uniqueId = uniqueId;
    return this;
  }

  withVisitDate(visitDate: Date): Family {
    this.visitDate = visitDate;
    return this;
  }

  studentsInSameSchool(student: Student): Student[] {
    return this.students.filter(s => s.targetSchool === student.targetSchool);
  }
}
