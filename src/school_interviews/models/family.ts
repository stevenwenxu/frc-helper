import { Person, Student } from "./person";

export class Family {
  parents: Person[] = [];
  students: Student[] = [];

  // this is the number in the URL, e.g. /parents/4936708732223488/details
  uniqueId: string = "";

  get people(): Person[] {
    return this.parents.concat(this.students);
  }

  withUniqueId(uniqueId: string): Family {
    this.uniqueId = uniqueId;
    return this;
  }
}
