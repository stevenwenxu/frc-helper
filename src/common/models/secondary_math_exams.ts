const SecondaryMathExamGradeLevel = [8, 9, 10, 11, 12] as const;
type SecondaryMathExamGradeLevel = typeof SecondaryMathExamGradeLevel[number];

const SecondaryMathExamAudience = ["college", "university"] as const;
type SecondaryMathExamAudience = typeof SecondaryMathExamAudience[number];

type SecondaryMathExam = {
  examYear: number;
  topicsAndQuestions: Record<string, number[]>;
};

type SecondaryMathCourse = {
  gradeLevel: SecondaryMathExamGradeLevel;
  audience: SecondaryMathExamAudience[];
  exams: SecondaryMathExam[];
};

type SecondaryMathExamsType = Record<string, SecondaryMathCourse>;

export const SecondaryMathExams: SecondaryMathExamsType = {
  "MAT1L": {
    "gradeLevel": 8,
    "audience": ["university", "college"],
    "exams": [],
  },
  "MTH1W": {
    "gradeLevel": 9,
    "audience": ["university", "college"],
    "exams": [
      {
        "examYear": 2015,
        "topicsAndQuestions": {
          "Number Sense": [3, 4],
          "Integers": [5],
          "Rational Numbers": [6],
          "Percent, Rates": [7, 8],
          "Algebra, P. Theorem": [9, 10, 18],
          "Geometry": [11, 12],
          "Measurement": [13, 19],
          "Patterning and Algebra": [20, 21],
        },
      },
    ],
  },
  "MPM2D": {
    "gradeLevel": 10,
    "audience": ["university", "college"],
    "exams": [
      {
        "examYear": 2015,
        "topicsAndQuestions": {
          "Proportions": [1],
          "Powers": [12],
          "Polynomials": [2, 3, 13, 14],
          "Solving Equations": [4, 15],
          "Pythagorean Theorem": [5],
          "Working with Formulas": [6, 16],
          "Graph Linear Relations": [9, 18],
          "Write Linear Relations": [19, 20],
          "Apply Linear Relations": [10, 21],
        },
      },
    ],
  },
  "MCF3M/MCR3U": {
    "gradeLevel": 11,
    "audience": ["university"],
    "exams": [
      {
        "examYear": 2015,
        "topicsAndQuestions": {
          "Algebra": [15],
          "Solving Equations": [16],
          "Factoring Expressions": [3],
          "Systems of Equations": [4, 5],
          "Analytic Geometry": [18, 19],
          "Similar Triangles": [6],
          "Trigonometry - Right": [7, 8],
          "Trigonometry - Acute": [21],
          "Relations": [22],
          "Graphing Quadratics": [23, 24],
          "Quadratic Functions": [25, 26, 27],
        },
      },
    ],
  },
  "MBF3C": {
    "gradeLevel": 11,
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
  "MHF4U/MCV4U": {
    "gradeLevel": 12,
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
  "MCT4C": {
    "gradeLevel": 12,
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
}

export function defaultCourseCode(grade: number, audience: SecondaryMathExamAudience) {
  return Object.keys(SecondaryMathExams).find(courseCode => {
    const course = SecondaryMathExams[courseCode];
    return course.gradeLevel === grade && course.audience.includes(audience);
  })!;
}
