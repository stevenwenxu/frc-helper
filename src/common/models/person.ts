import { NameHelper } from "../helpers/name_helper";
import { SchoolCategory } from "./school_category";

export abstract class Person {
  firstName = "";
  middleName = "";
  lastName = "";
  phone = "";
  address = "";

  set name(name: string) {
    const [firstName, middleName, lastName] = NameHelper.nameToParts(name);
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
  }
}

export class Parent extends Person {
  email = "";
  parentNotes = "";
}

export class Student extends Person {
  dateOfBirth = "";
  countryOfBirth = "";
  studentNotes = "";

  // Fields below are captured from Aspen, they are used to generate email.
  localId = "";
  grade = "";
  secondaryCourseRecommendations = "";
  schoolCategory = SchoolCategory.Unknown;
  overallStepLevel = "";
  educationComments = "";
  homeLanguage = "";
  // Students who are registered at FRC Holding School are pending transfer to their target school.
  pendingTransfer = true;
  targetSchool = "";
}
