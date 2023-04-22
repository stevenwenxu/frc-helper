export type SecondaryMathExamGradeLevel = "8" | "9" | "10" | "11" | "12";
export type SecondaryMathExamAudience = "college" | "university";
type SecondaryMathExam = {
  examYear: number;
  topicsAndQuestions: Record<string, number[]>;
};
type SecondaryMathCourse = {
  audience: SecondaryMathExamAudience[];
  exams: SecondaryMathExam[];
};
type SecondaryMathExamsType = Record<SecondaryMathExamGradeLevel, Record<string, SecondaryMathCourse>>;

export const SecondaryMathExams: SecondaryMathExamsType = {
  "8": {
    "MAT1L": {
      "audience": ["university", "college"],
      "exams": [],
    },
  },
  "9": {
    "MTH1W": {
      "audience": ["university", "college"],
      "exams": [
        {
          "examYear": 2015,
          "topicsAndQuestions": {
            "Number Sense": [0],
            "Integers": [0],
            "Rational Numbers": [0],
            "Percent, Rates": [0],
            "Algebra": [0],
            "Geometry": [0],
            "Measurement": [0],
            "Patterning": [0],
          },
        },
      ],
    },
  },
  "10": {
    "MPM2D": {
      "audience": ["university", "college"],
      "exams": [
        {
          "examYear": 2015,
          "topicsAndQuestions": {
            "Powers": [12],
            "Polynomials": [13, 14],
            "Solving Equations": [15],
            "Working with Formulas": [16, 17],
            "Graph Linear Relations": [18],
            "Write Linear Relations": [19, 20],
            "Apply Linear Relations": [21],
          },
        },
      ],
    },
  },
  "11": {
    "MBF3C": {
      "audience": ["college"],
      "exams": [
        {
          "examYear": 2015,
          "topicsAndQuestions": {
            "Algebra": [1],
            "Solving Equations": [2],
            "Factoring Expressions": [3],
            "Systems of Equations": [4, 5],
            "Similar Triangles": [6],
            "Trigonometry - Right": [7, 8],
            "Quadratic Functions": [9, 10],
            "Measurement": [11, 12],
            "Conversions": [13, 14],
          },
        },
      ],
    },
    "MCF3M/MCR3U": {
      "audience": ["university"],
      "exams": [
        {
          "examYear": 2015,
          "topicsAndQuestions": {
            "Algebra": [15],
            "Solving Equations": [16],
            "Factoring Expressions": [17],
            "Systems of Equations": [4, 5],
            "Analytic Geometry": [18, 19],
            "Similar Triangles": [6],
            "Trigonometry - Right": [20],
            "Trigonometry - Acute": [21],
            "Relations": [22],
            "Graphing Quadratics": [23, 24],
            "Quadratic Functions": [25, 26, 27],
          },
        },
      ],
    },
  },
  "12": {
    "MCT4C": {
      "audience": ["college"],
      "exams": [
        {
          "examYear": 2015,
          "topicsAndQuestions": {
            "Powers": [1, 2],
            "Polynomials": [3, 4],
            "Domain and Range": [5],
            "Function Notation": [6, 7],
            "Quadratic Functions": [8, 9],
            "Quadratic Equations": [10],
            "Trigonometry": [11],
            "Trigonometric Functions": [12, 13],
            "Measurement": [14],
          },
        },
      ],
    },
    "MHF4U/MCV4U": {
      "audience": ["university"],
      "exams": [
        {
          "examYear": 2015,
          "topicsAndQuestions": {
            "Powers": [1, 2],
            "Polynomials": [15, 16, 17],
            "Domain and Range": [5],
            "Radicals": [18],
            "Rational Expressions": [19],
            "Function Notation": [6, 7],
            "Quadratic Functions": [20, 21],
            "Quadratic Equations": [22, 23, 24],
            "Trigonometry": [25, 26, 27],
            "Trigonometric Functions": [28, 29],
          },
        },
      ],
    },
  },
};
