export class SecondaryMathAssessment {
  tasks: string[] = [];
  // Grade level of the exam chosen for the student, not necessarily the student's current grade level
  gradeLevelOfExam: string = "";
  topicsAndGrade: TopicsAndGrade[] = [];
  passed: boolean = false;
}

export type TopicsAndGrade = {
  topic: string;
  grade: "P" | "S" | "L";
};
