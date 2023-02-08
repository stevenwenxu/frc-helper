import { Person, Student } from "./person";

export class Family {
  parents: Person[] = [];
  students: Student[] = [];

  get people(): Person[] {
    return this.parents.concat(this.students);
  }
}
