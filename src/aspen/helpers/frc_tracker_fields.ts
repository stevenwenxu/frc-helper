import { LanguageCategory } from "../../common/models/language_category";
import { Student } from "../../common/models/person";
import { SchoolCategory } from "../../common/models/school_category";

export class FRCTrackerFields {
  static schoolCategory(dropdownValue: number) {
    if ((dropdownValue >= 1 && dropdownValue <= 9) || (dropdownValue >= 26 && dropdownValue <= 29)) {
      return SchoolCategory.Elementary;
    } else if ((dropdownValue >= 10 && dropdownValue <= 14) || (dropdownValue >= 30 && dropdownValue <= 31)) {
      return SchoolCategory.Kindergarten;
    } else if (dropdownValue >= 15 && dropdownValue <= 25) {
      return SchoolCategory.Secondary;
    } else {
      return SchoolCategory.Unknown;
    }
  }

  static languageCategory(dropdownValue: number) {
    if ((dropdownValue >= 1 && dropdownValue <= 4) ||
      (dropdownValue >= 10 && dropdownValue <= 13) ||
      (dropdownValue >= 15 && dropdownValue <= 19) ||
      (dropdownValue >= 26 && dropdownValue <= 27) ||
      (dropdownValue >= 30 && dropdownValue <= 31)) {
      return LanguageCategory.ESL;
    } else if ((dropdownValue >= 5 && dropdownValue <= 8) ||
      (dropdownValue >= 20 && dropdownValue <= 24) ||
      (dropdownValue >= 28 && dropdownValue <= 29)) {
      return LanguageCategory.ELD;
    } else if (dropdownValue == 9 || dropdownValue == 14 || dropdownValue == 25) {
      return LanguageCategory.Native;
    } else {
      return LanguageCategory.Unknown;
    }
  }

  static secondaryEnglishCourse(dropdownValue: number) {
    const language = this.languageCategory(dropdownValue);
    const overall = this.overallCategory(dropdownValue);
    const school = this.schoolCategory(dropdownValue);

    if (school !== SchoolCategory.Secondary) {
      return "";
    } else if (language === LanguageCategory.Native || overall === "6") {
      return "ENG2D";
    } else if (language == LanguageCategory.Unknown || overall === "") {
      return "";
    } else {
      // ESLAO, ESLBO, ..., ELDAO, ELDBO, ...
      return `${language}${String.fromCharCode("A".charCodeAt(0) + parseInt(overall) - 1)}O`;
    }
  }

  static overallCategory(dropdownValue: number) {
    switch (dropdownValue) {
      case 1: case 5: case 10: case 15: case 20: return "1";
      case 2: case 6: case 11: case 16: case 21: return "2";
      case 3: case 7: case 12: case 17: case 22: return "3";
      case 4: case 8: case 13: case 18: case 23: return "4";
      case 26: case 28: case 30: case 19: case 24: return "5";
      case 27: case 29: case 31: return "6";
      default: return "";
    }
  }

  static assessorComments(student: Student, dropdownValue: number, oral: string, reading: string, writing: string) {
    const name = student.firstName;
    const schoolCategory = this.schoolCategory(dropdownValue);
    const languageCategory = this.languageCategory(dropdownValue);
    const overallCategory = this.overallCategory(dropdownValue);
    const secondaryEnglish = this.secondaryEnglishCourse(dropdownValue);

    let comment = "";

    if (languageCategory === LanguageCategory.Native) {
      comment = `${name}'s first language is English, therefore ${name} may be assessed with the tools used for native speakers.`;
    } else if (schoolCategory === SchoolCategory.Kindergarten) {
      comment = `Although ${name} is a beginner in English, it is OCDSB's practice that Kindergarten English language learners are not stepped using Steps to English Proficiency at the time. This is because it is difficult to accurately determine the level of English proficiency in young children. However, ${name}'s English language development should be tracked by the teachers in case ${name} might be considered for ESL programming in grade 1.`
    } else {
      if (languageCategory === LanguageCategory.ELD) {
        comment = `In view of the gap between ${name}'s age and the academic skills, it is recommended that ${name} be provided with English Literacy Development (ELD) programming. ${name} will require support for developing English language proficiency and literacy across the curriculum.\n\n`;
      }
      comment += `${name} was assessed using the Steps to English Proficiency (STEP) initial assessment tool, based on this initial assessment, ${name} is working in ${languageCategory} STEP ${overallCategory}:
Oral ${languageCategory} STEP ${oral}
Reading ${languageCategory} STEP ${reading}
Writing ${languageCategory} STEP ${writing}.`;
    }

    if (schoolCategory === SchoolCategory.Secondary) {
      comment += `\n\nBased on the initial assessment, ${secondaryEnglish} is recommended for English, and MTH1W is recommended for mathematics.`;
    }

    return comment;
  }

  static languageSupport(dropdownValue: number) {
    // 1: no support required, 2: ESL, 3: ELD
    const schoolCategory = this.schoolCategory(dropdownValue);
    const languageCategory = this.languageCategory(dropdownValue);
    const overallCategory = this.overallCategory(dropdownValue);

    if (schoolCategory === SchoolCategory.Kindergarten) {
      return "1";
    } else if (languageCategory === LanguageCategory.Native) {
      return "1";
    } else if (languageCategory === LanguageCategory.ELD) {
      return "3";
    } else if (overallCategory === "") {
      return "";
    } else if (languageCategory === LanguageCategory.ESL && schoolCategory === SchoolCategory.Elementary) {
      switch (overallCategory) {
        case "1": case "2": case "3": case "4": return "2";
        case "5": case "6": return "1";
      }
    } else if (languageCategory === LanguageCategory.ESL && schoolCategory === SchoolCategory.Secondary) {
      switch (overallCategory) {
        case "1": case "2": case "3": case "4": case "5": return "2";
        case "6": return "1";
      }
    } else {
      return "";
    }
  }
}
