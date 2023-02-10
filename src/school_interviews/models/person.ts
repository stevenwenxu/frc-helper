import { NameHelper } from "../helpers/name_helper";

export abstract class Person {
  firstName: string | null = null;
  middleName: string | null = null;
  lastName: string | null = null;
  phone: string | null = null;
  address: string | null = null;

  set name(name: string | null) {
    const [firstName, middleName, lastName] = NameHelper.nameToParts(name);
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
  }
}

export class Parent extends Person {
  email: string | null = null;
  parentNotes: string | null = null;
}

export class Student extends Person {
  dateOfBirth: string | null = null;
  countryOfBirth: string | null = null;
  studentNotes: string | null = null;
}
