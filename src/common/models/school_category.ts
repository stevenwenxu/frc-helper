export enum SchoolCategory {
  Elementary = "elementary",
  Kindergarten = "kindergarten",
  Secondary = "secondary",
  Unknown = "unknown"
}

export function schoolCategoryFromGrade(grade: string) {
  if (grade === "JK" || grade === "SK") {
    return SchoolCategory.Kindergarten;
  }
  const gradeNum = parseInt(grade);
  if (isNaN(gradeNum)) {
    return SchoolCategory.Unknown;
  } else {
    return gradeNum <= 8 ? SchoolCategory.Elementary : SchoolCategory.Secondary;
  }
}
