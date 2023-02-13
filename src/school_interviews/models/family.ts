import { Parent, Student } from "./person";

export class Family {
  parents: Parent[] = [];
  students: Student[] = [];
  private _visitDate: string = "";

  // this is the number in the URL, e.g. /parents/4936708732223488/details
  uniqueId: string = "";

  get people() {
    return [...this.parents, ...this.students];
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
}
