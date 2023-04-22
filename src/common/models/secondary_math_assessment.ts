import { SecondaryMathExamAudience } from "./secondary_math_exams";

type SecondaryMathAssessmentResult = Record<"P" | "S" | "L", string[]>;

export class SecondaryMathAssessment {
  tasks: string[];
  // Grade level of the exam chosen for the student, not necessarily the student's current grade level
  gradeLevelOfExam: "9" | "10" | "11" | "12";
  examAudience: SecondaryMathExamAudience;
  result: SecondaryMathAssessmentResult;
  passed: boolean;

  constructor(gradeLevelOfExam: "9" | "10" | "11" | "12", examAudience: SecondaryMathExamAudience) {
    this.tasks = [];
    this.gradeLevelOfExam = gradeLevelOfExam;
    this.examAudience = examAudience;
    this.result = { "P": [], "S": [], "L": [] };
    this.passed = false;
  }
}

