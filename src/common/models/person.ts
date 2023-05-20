import { SecondaryMathAssessment } from "./secondary_math_assessment";
import { NameHelper } from "../helpers/name_helper";
import { Gender } from "./gender";
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

  get fullName() {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
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
  gender = Gender.PreferNotToDisclose;
  localId = "";
  // JK, SK, 1-12
  grade = "";
  // If grade is manually set, grade in Aspen Demographics is ignored.
  isGradeManuallySet = false;
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
  currentSchool = "";
  transferSchool = "";
  pendingTransferChecked = true;
  secondaryMathAssessment: SecondaryMathAssessment | null = null;

  get overallStepLevelForEmail() {
    switch (this.languageCategory) {
      case LanguageCategory.Native: return "No ESL";
      case LanguageCategory.ESL: return `ESL STEP ${this.overallStep}`;
      case LanguageCategory.ELD: return `ELD STEP ${this.overallStep}`;
      case LanguageCategory.Unknown: return "";
    }
  }

  get targetSchool() {
    return this.transferSchool || this.currentSchool;
  }

  get isNewRegistration() {
    return this.transferSchool.length > 0;
  }

  get gradeText() {
    const gradeNum = parseInt(this.grade);
    return isNaN(gradeNum) ? this.grade : `Grade ${gradeNum}`;
  }

  get capitalizedPronoun() {
    switch (this.gender) {
      case Gender.Female: return "She";
      case Gender.Male: return "He";
      default: return "They";
    }
  }

  get displayName() {
    return `${this.lastName}, ${this.firstName}`;
  }
}
