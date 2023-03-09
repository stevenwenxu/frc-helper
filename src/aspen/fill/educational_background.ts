import { Student } from "../../common/models/person";
import { FamilyRepository } from "../../common/family_repository";
import { EducationalBackgroundFields } from "../helpers/educational_background_fields";
import { setValue } from "../fill";

export function fillEducationalBackground(student: Student) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const name = student.firstName;

  const schoolYear = elements.namedItem("propertyValue(pgmFieldB002)") as HTMLInputElement;
  setValue(schoolYear, EducationalBackgroundFields.schoolYear(), false);

  setValue(
    elements.namedItem("propertyValue(pgmFieldA002)") as HTMLInputElement,
    "Yes",
    false
  );

  setValue(
    elements.namedItem("propertyValue(pgmFieldD001)") as HTMLInputElement,
    `Favorite Subject: Mathematics.\nInterests/Hobbies: ${name} likes music.\nGoal: ${name} wants to become a doctor in the future.`,
    false
  );
}

export function setupEducationalBackgroundHooks(familyId: string, personIndex: number) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const grade = elements.namedItem("propertyValue(pgmFieldA001)") as HTMLSelectElement;
  const complete = elements.namedItem("propertyValue(pgmFieldA002)") as HTMLInputElement;
  const country = elements.namedItem("propertyValue(pgmFieldB001)") as HTMLSelectElement;
  const schoolYear = elements.namedItem("propertyValue(pgmFieldB002)") as HTMLInputElement;
  const comments = elements.namedItem("propertyValue(pgmFieldD002)") as HTMLInputElement;

  comments.addEventListener("change", async () => {
    await saveEducationComments(familyId, personIndex);
  });

  [grade, complete, country, schoolYear].forEach(element => {
    element.addEventListener("change", async () => {
      const family = await FamilyRepository.getFamilyWithUniqueId(familyId);
      if (!family) { return; }
      const student = family.people[personIndex] as Student;
      setValue(
        comments,
        EducationalBackgroundFields.comments(
          student,
          grade.value,
          complete.value === "Yes",
          country.selectedOptions[0].textContent || "",
          schoolYear.value
        )
      );
    });
  });
}

export async function saveEducationComments(familyId: string, personIndex: number) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const comments = elements.namedItem("propertyValue(pgmFieldD002)") as HTMLInputElement;

  await FamilyRepository.updateStudent(familyId, personIndex, (student) => {
    student.educationComments = comments.value;
    return student;
  });
}
