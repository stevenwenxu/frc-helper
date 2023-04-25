import { SecondaryMathExams } from "./secondary_math_exams";

export const SecondaryMathAssessmentGrade = ["P", "S", "L"] as const;
export type SecondaryMathAssessmentGrade = typeof SecondaryMathAssessmentGrade[number];

type SecondaryMathAssessmentGrading = Record<SecondaryMathAssessmentGrade, string[]>;

export const SecondaryMathExamLevel = [9, 10, 11, 12] as const;
export type SecondaryMathExamLevel = typeof SecondaryMathExamLevel[number];

export class SecondaryMathAssessment {
  diagnosticTasks: string[];
  courseCode: string;
  gradingTable: SecondaryMathAssessmentGrading;
  passed: boolean;

  constructor(courseCode: string) {
    this.diagnosticTasks = [];
    this.courseCode = courseCode;
    this.gradingTable = { "P": [], "S": [], "L": [] };
    this.passed = true;
  }

  get gradeLevelOfExam() {
    return SecondaryMathExams[this.courseCode].gradeLevel as SecondaryMathExamLevel;
  }

  get examAudience() {
    return SecondaryMathExams[this.courseCode].audience[0];
  }
}
