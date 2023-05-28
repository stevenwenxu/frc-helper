import { LanguageCategory } from "../../common/models/language_category";
import { Student } from "../../common/models/person";
import { setValue } from "../../common/helpers/fill_helper";

export function fillELL(student: Student) {
  const elements = document.forms.namedItem("childDetailForm")!.elements;

  // ELL - Start Date
  setValue(
    elements.namedItem("propertyValue(pgmActionStart)") as HTMLInputElement,
    new Date().toDateString(),
    false
  );

  // ELL - ELL program
  setValue(
    elements.namedItem("propertyValue(pgmFieldA001)") as HTMLInputElement,
    (() => {
      switch (student.languageCategory) {
        case LanguageCategory.Native: return "";
        case LanguageCategory.ESL: return "ESL";
        case LanguageCategory.ELD: return "ELD";
        case LanguageCategory.Unknown: return "";
      }
    })(),
    false
  );

  // ELL Data - ELL assessment date
  setValue(
    elements.namedItem("propertyValue(pgmFieldA002)") as HTMLInputElement,
    new Date().toDateString(),
    false
  );

  // ELL Data - overall
  setValue(
    elements.namedItem("propertyValue(pgmFieldA003)") as HTMLInputElement,
    student.overallStep,
    false
  );

  // ELL Data - listening
  setValue(
    elements.namedItem("propertyValue(pgmFieldA004)") as HTMLInputElement,
    student.listeningStep,
    false
  );

  // ELL Data - speaking
  setValue(
    elements.namedItem("propertyValue(pgmFieldA005)") as HTMLInputElement,
    student.speakingStep,
    false
  );

  // ELL Data - reading
  setValue(
    elements.namedItem("propertyValue(pgmFieldA006)") as HTMLInputElement,
    student.readingStep,
    false
  );

  // ELL Data - writing
  setValue(
    elements.namedItem("propertyValue(pgmFieldA007)") as HTMLInputElement,
    student.writingStep,
    false
  );
}
