import { Parent, Student } from "./person";

export class Family {
  parents: Parent[] = [];
  students: Student[] = [];

  // this is the number in the URL, e.g. /parents/4936708732223488/details
  uniqueId: string = "";

  get people() {
    return [...this.parents, ...this.students];
  }

  withUniqueId(uniqueId: string): Family {
    this.uniqueId = uniqueId;
    return this;
  }
}
