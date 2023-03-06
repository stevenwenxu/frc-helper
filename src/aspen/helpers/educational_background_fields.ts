import { Student } from "../../common/models/person";

export class EducationalBackgroundFields {
  static schoolYear() {
    const today = new Date();
    const schoolYearStart = today.getMonth() <= 10 ? today.getFullYear() - 1 : today.getFullYear();
    return `${schoolYearStart}-${schoolYearStart + 1}`;
  }

  static comments(student: Student, rawGrade: string, complete: boolean, country: string, schoolYear: string) {
    const completeText = complete ? "finished" : "registered in";
    const gradeNum = parseInt(rawGrade);
    const grade = isNaN(gradeNum) ? rawGrade : `grade ${gradeNum}`;

    return `According to the family, ${student.firstName} ${completeText} ${grade} in ${country} in the school year ${schoolYear}. The teaching language was English. Please find the report cards attached. / No official school document was provided to FRC.`;
  }
}
