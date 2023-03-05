import { Student } from "../../common/models/person";
import { EducationalBackgroundFields } from "../helpers/educational_background_fields";
import { setValue } from "../fill";

export function fillEducationalBackground(student: Student) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const name = student.firstName;

  const schoolYear = elements.namedItem("propertyValue(pgmFieldB002)") as HTMLInputElement;
  setValue(schoolYear, EducationalBackgroundFields.schoolYear());

  setValue(
    elements.namedItem("propertyValue(pgmFieldA002)") as HTMLInputElement,
    "Yes"
  );

  setValue(
    elements.namedItem("propertyValue(pgmFieldD001)") as HTMLInputElement,
    `${name}'s favourite subject is mathematics, and ${name} wants to become a doctor in the future.`
  );
}

export function setupEducationalBackgroundHooks(student: Student) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;
  const grade = elements.namedItem("propertyValue(pgmFieldA001)") as HTMLSelectElement;
  const country = elements.namedItem("propertyValue(pgmFieldB001)") as HTMLSelectElement;
  const schoolYear = elements.namedItem("propertyValue(pgmFieldB002)") as HTMLInputElement;
  const comments = elements.namedItem("propertyValue(pgmFieldD002)") as HTMLInputElement;

  [grade, country, schoolYear].forEach(element => {
    element.addEventListener("change", () => {
      setValue(
        comments,
        EducationalBackgroundFields.comments(
          student,
          grade.value,
          country.selectedOptions[0].textContent || "",
          schoolYear.value
        )
      );
    });
  });
}
