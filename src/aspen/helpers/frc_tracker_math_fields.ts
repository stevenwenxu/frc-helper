import { Student } from "../../common/models/person";
import { SecondaryMathAssessment } from "../../common/models/secondary_math_assessment";
import { SecondaryMathExamGradeLevel, SecondaryMathExams } from "../../common/models/secondary_math_exams";

export class FRCTrackerMathFields {
  static mathTasks(student: Student) {
    switch (student.grade) {
      case "JK": return "Counters and shapes";
      case "SK": return "Manipulatives and shapes";
      case "1": return "B - Number Sense and Numeration";
      case "2": return "B - Number Sense and Numeration Initial Assessment (Grade 2)";
      case "3": return "C - Number Sense and Numeration Initial Assessment (Grade 3)";
      case "4": return "D - Number Sense and Numeration Initial Assessment (Grade 4)";
      case "5": return "E - Number Sense and Numeration Initial Assessment (Grade 5)";
      case "6": return "F - Number Sense and Numeration Initial Assessment (Grade 6)";
      case "7": return "G - Number Sense and Numeration Initial Assessment (Grade 7)";
      case "8": return "H - Number Sense and Numeration Initial Assessment (Grade 8)";
      case "9":
      case "10":
      case "11":
      case "12":
        return student.secondaryMathAssessment?.tasks.join("\n") || "";
      default:
        return "";
    }
  }

  static mathObservations(student: Student) {
    switch (student.grade) {
      case "JK":
        return `${student.firstName} was able to group the same coloured counters to the same group and count out the number of counters in each group. ${student.capitalizedPronoun} could count from 1 to 20 in English, and identify the basic shapes.`;
      case "SK":
        return `${student.firstName} was able to group the same coloured counters to one group, and count out the number of manipulatives in each group. ${student.capitalizedPronoun} could count from 1 to 30 in English, and identify all the basic shapes.`;
      case "1":
        return `${student.firstName} was able to read and represent whole numbers up to 50. ${student.firstName} showed that ${student.capitalizedPronoun.toLowerCase()} is able to add and subtract single-digit whole numbers correctly.`;
      case "2":
        return `${student.firstName} demonstrated computational skills that are at the grade 2 level. ${student.capitalizedPronoun} was able to read and represent whole numbers up to 50. ${student.capitalizedPronoun} worked well with adding and subtracting two-digit numbers.`;
      case "3":
        return `${student.firstName} demonstrated computational skills that are approximate to the grade 3 level. ${student.capitalizedPronoun} was able to order the numbers in increasing and decreasing orders. ${student.capitalizedPronoun} was able to add and subtract two-digit numbers with one-digit numbers.`;
      case "4":
        return `${student.firstName} demonstrated computational skills that are approximately at the grade 4 level. ${student.capitalizedPronoun} was able to add and subtract three-digit numbers. ${student.capitalizedPronoun} worked well on two-digit multiplications and divisions.`;
      case "5":
        return `${student.firstName} demonstrated computational skills that are approximately at the grade 5 level. ${student.capitalizedPronoun} was able to add and subtract four-digit numbers. ${student.capitalizedPronoun} worked well on two-digit multiplications and divisions.`;
      case "6":
        return `${student.firstName} demonstrated computational skills that are approximately at the grade 6 level. ${student.capitalizedPronoun} was able to add and subtract four-digit whole numbers. ${student.firstName} showed that ${student.capitalizedPronoun.toLowerCase()} can multiply two-digit numbers, and divide three-digit numbers by one-digit numbers. ${student.firstName} needs to work on order fractions with like denominators.`;
      case "7":
        return `${student.firstName} demonstrated computational skills that are approximately at the grade 7 level. ${student.capitalizedPronoun} was able to add and subtract four-digit numbers. ${student.capitalizedPronoun} was also able to do the multi-digit multiplication and division. ${student.firstName} needs to improve in addition and subtraction to the decimal numbers.`;
      case "8":
        return `${student.firstName} demonstrated computational skills that are approximately at the grade 8 level. ${student.capitalizedPronoun} was able to add and subtract integers, decimal numbers, and fractions. ${student.firstName} multiplied and divided four-digit numbers by two-digit numbers. ${student.firstName} needs to work on solving equations that contain brackets, using order of operations.`;
      case "9":
      case "10":
      case "11":
      case "12": {
        const assessment = student.secondaryMathAssessment;
        if (!assessment) {
          return "";
        }
        const formatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
        let str = `${student.firstName} was assessed using the Incoming Grade ${assessment.gradeLevelOfExam} Mathematics Assessment.`;
        if (assessment.result.P.length > 0) {
          str += `\n${student.capitalizedPronoun} demonstrated proficiency in ${formatter.format(assessment.result.P)}.`;
        }
        if (assessment.result.S.length > 0) {
          str += `\n${student.capitalizedPronoun} showed some proficiency in ${formatter.format(assessment.result.S)}.`;
        }
        if (assessment.result.L.length > 0) {
          str += `\n${student.capitalizedPronoun} lacked proficiency in the aspects of ${formatter.format(assessment.result.L)}.`;
        }
        if (assessment.passed) {
          str += `\nTherefore, ${this.courseCode(assessment)} is recommended for mathematics.`;
        } else {
          str += `\nBased on the math initial assessment, ${student.firstName} lacked proficiency in several topics, therefore the ${this.courseCode(assessment)} course is recommended for mathematics.`;
        }
        return str;
      }
      default:
        return "";
    }
  }

  private static courseCode(assessment: SecondaryMathAssessment) {
    let grade: SecondaryMathExamGradeLevel = assessment.gradeLevelOfExam;
    if (!assessment.passed) {
      grade = `${parseInt(grade) - 1}` as SecondaryMathExamGradeLevel;
    }
    const courses = SecondaryMathExams[grade];
    const courseCode = Object.keys(courses).filter(courseCode => {
      return courses[courseCode].audience.includes(assessment.examAudience);
    }).at(0) || "UNKNOWN";
    return courseCode;
  }
}
