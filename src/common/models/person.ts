import { SecondaryMathAssessment } from "./secondary_math_assessment";
import { NameHelper } from "../helpers/name_helper";
import { Gender } from "./gender";
import { LanguageCategory } from "./language_category";
import { SchoolCategory } from "./school_category";
import { StatusInCanada } from "./status_in_canada";

export abstract class Person {
  firstName = "";
  middleName = "";
  lastName = "";
  phone = "";
  address = "";
  // Address edits are synced across all family members unless this is set to true.
  isAddressUnique = false;

  set name(name: string) {
    const [firstName, middleName, lastName] = NameHelper.nameToParts(name);
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
  }

  get fullName() {
    return NameHelper.fullNameFromParts(this.firstName, this.middleName, this.lastName);
  }

  get initials() {
    return `${this.lastName[0]}.${this.firstName[0]}.`;
  }

  get displayName() {
    return `${this.lastName}, ${this.firstName}`;
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

  // Fields below are captured from Aspen Demographics.
  legalFirstName = "";
  legalMiddleName = "";
  legalLastName = "";
  gender = Gender.PreferNotToDisclose;
  localId = "";
  // Grade on the page. The actual `grade` is incremented if the student is pre-registered to next year.
  demographicsGrade = "";
  homeLanguage = "";
  currentSchool = "";
  transferSchool = "";
  pendingTransferChecked = true;
  nextYearSchool = "";

  // Fields below are captured from Aspen Citizenship.
  statusInCanada = StatusInCanada.NotApplicable;
  countryOfLastResidence = "";
  dateOfEntryToCanada = "";

  // Fields below are captured from Aspen FRC Tracker.
  secondaryCourseRecommendations = "";
  languageCategory = LanguageCategory.Unknown;
  listeningStep = "";
  speakingStep = "";
  readingStep = "";
  writingStep = "";
  overallStep = "";
  educationComments = "";
  secondaryMathAssessment: SecondaryMathAssessment | null = null;

  get targetSchool() {
    return this.nextYearSchool || this.transferSchool || this.currentSchool;
  }

  get isNewRegistration() {
    return this.transferSchool.length > 0;
  }

  get isPreRegistration() {
    return this.nextYearSchool.length > 0;
  }

  // Actual grade of the student used for assessments, comments, worksheets, etc.
  get grade() {
    if (this.isPreRegistration) {
      switch (this.demographicsGrade) {
        case "JK": return "SK";
        case "SK": return "1";
        case "12": return "12";
        default: return `${parseInt(this.demographicsGrade) + 1}`;
      }
    } else {
      return this.demographicsGrade;
    }
  }

  get capitalizedPronoun() {
    switch (this.gender) {
      case Gender.Female: return "She";
      case Gender.Male: return "He";
      default: return "They";
    }
  }

  get legalFullName() {
    return `${this.legalLastName}, ${this.legalFirstName} ${this.legalMiddleName}`;
  }

  get firstNameWithGrade() {
    const gradePrefix = this.grade.length > 0 ? `${this.grade}-` : "";
    return `${gradePrefix}${this.firstName}`;
  }

  get schoolCategory() {
    if (this.grade === "JK" || this.grade === "SK") {
      return SchoolCategory.Kindergarten;
    }
    const gradeNum = parseInt(this.grade);
    if (isNaN(gradeNum)) {
      return SchoolCategory.Unknown;
    } else {
      return gradeNum <= 8 ? SchoolCategory.Elementary : SchoolCategory.Secondary;
    }
  }

  get schoolYear() {
    const today = new Date();
    const month = today.getMonth() + 1;
    // Jan-Aug: lastYear-thisYear, Sep-Dec: thisYear-nextYear
    let startYear = month < 9 ? today.getFullYear() - 1 : today.getFullYear();
    if (this.isPreRegistration) {
      startYear += 1;
    }
    return `${startYear}-${startYear + 1}`;
  }
}
