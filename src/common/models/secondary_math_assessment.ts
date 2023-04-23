import { SecondaryMathExamGradeLevel, SecondaryMathExams } from "./secondary_math_exams";

export const SecondaryMathAssessmentGrade = ["P", "S", "L"] as const;
export type SecondaryMathAssessmentGrade = typeof SecondaryMathAssessmentGrade[number];
type SecondaryMathAssessmentGrading = Record<SecondaryMathAssessmentGrade, string[]>;
export type SecondaryMathExamLevel = "9" | "10" | "11" | "12";

export class SecondaryMathAssessment {
  diagnosticTasks: string[];
  courseCode: string;
  gradingTable: SecondaryMathAssessmentGrading;
  passed: boolean;

  constructor(courseCode: string) {
    this.diagnosticTasks = [];
    this.courseCode = courseCode;
    this.gradingTable = { "P": [], "S": [], "L": [] };
    this.passed = false;
  }

  get gradeLevelOfExam(): SecondaryMathExamLevel {
    const gradeLevels = Object.keys(SecondaryMathExams) as SecondaryMathExamGradeLevel[];
    return gradeLevels.find(grade => {
      return SecondaryMathExams[grade][this.courseCode] != undefined
    })! as SecondaryMathExamLevel;
  }

  get examAudience() {
    const courses = Object.values(SecondaryMathExams).find(course => {
      return course[this.courseCode] != undefined;
    })!;
    return courses[this.courseCode].audience[0];
  }
}
