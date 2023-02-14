import { NameHelper } from "../../school_interviews/helpers/name_helper";

export abstract class Person {
  firstName: string = "";
  middleName: string = "";
  lastName: string = "";
  phone: string = "";
  address: string = "";

  set name(name: string) {
    const [firstName, middleName, lastName] = NameHelper.nameToParts(name);
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
  }
}

export class Parent extends Person {
  email: string = "";
  parentNotes: string = "";
}

export class Student extends Person {
  dateOfBirth: string = "";
  countryOfBirth: string = "";
  studentNotes: string = "";
}
