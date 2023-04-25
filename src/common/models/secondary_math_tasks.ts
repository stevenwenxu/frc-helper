import { SecondaryMathExamLevel } from "./secondary_math_assessment";

type SecondaryMathTasksType = {
  diagnosticTasks: string[];
  assessment: Record<SecondaryMathExamLevel, string>;
};

export const SecondaryMathTasks: SecondaryMathTasksType = {
  "diagnosticTasks": ["A", "B", "C", "D"],
  "assessment": {
    9: "Incoming Grade 9 Mathematics Assessment",
    10: "Incoming Grade 10 Mathematics Assessment",
    11: "Incoming Grade 11 Mathematics Assessment",
    12: "Incoming Grade 12 Mathematics Assessment",
  },
}
