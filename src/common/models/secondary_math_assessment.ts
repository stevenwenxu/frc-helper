import { SecondaryMathExamGradeLevel, SecondaryMathExams } from "./secondary_math_exams";

type SecondaryMathAssessmentResult = Record<"P" | "S" | "L", string[]>;
export type SecondaryMathExamLevel = "9" | "10" | "11" | "12";

export class SecondaryMathAssessment {
  diagnosticTasks: string[];
  courseCode: string;
  result: SecondaryMathAssessmentResult;
  passed: boolean;

  constructor(courseCode: string) {
    this.diagnosticTasks = [];
    this.courseCode = courseCode;
    this.result = { "P": [], "S": [], "L": [] };
    this.passed = false;
  }

  get gradeLevelOfExam() {
    const gradeLevels = Object.keys(SecondaryMathExams) as SecondaryMathExamGradeLevel[];
    return gradeLevels.find((gradeLevel) => {
      const courseCodes = Object.keys(SecondaryMathExams[gradeLevel]);
      return courseCodes.includes(this.courseCode);
    })! as SecondaryMathExamLevel;
  }

  get examAudience() {
    const courses = Object.values(SecondaryMathExams).find(course => {
      return course[this.courseCode] != undefined;
    })!;
    return courses[this.courseCode].audience[0];
  }
}
