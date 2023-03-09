import { NameHelper } from "../helpers/name_helper";
import { LanguageCategory } from "./language_category";
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

  get initials() {
    return `${this.lastName[0]}.${this.firstName[0]}.`;
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
  languageCategory = LanguageCategory.Unknown;
  listeningStep = "";
  speakingStep = "";
  readingStep = "";
  writingStep = "";
  overallStep = "";
  educationComments = "";
  homeLanguage = "";
  // Students who are registered at FRC Holding School are pending transfer to their target school.
  pendingTransfer = true;
  targetSchool = "";

  get overallStepLevelForEmail() {
    switch (this.languageCategory) {
      case LanguageCategory.Native: return "No ESL";
      case LanguageCategory.ESL: return `ESL STEP ${this.overallStep}`;
      case LanguageCategory.ELD: return `ELD STEP ${this.overallStep}`;
      case LanguageCategory.Unknown: return "";
    }
  }
}
