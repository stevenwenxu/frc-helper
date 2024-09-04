import { Student } from "../../common/models/person";
import { setValue } from "../../common/helpers/fill_helper";
import { SchoolCategory } from "../../common/models/school_category";

export function fillTransfer(student: Student) {
  const elements = document.forms.namedItem("transferForm")!.elements;
  let entryCode: string | null;
  switch (student.schoolCategory) {
    case SchoolCategory.Elementary:
    case SchoolCategory.Kindergarten:
      entryCode = "05";
      break;
    case SchoolCategory.Secondary:
      entryCode = "09";
      break;
    default:
      entryCode = null;
      break;
  }

  setValue(
    elements.namedItem("withdrawalDate") as HTMLInputElement,
    new Date().toDateString()
  );

  setValue(
    elements.namedItem("code") as HTMLInputElement,
    "64"
  );

  setValue(
    elements.namedItem("reason") as HTMLInputElement,
    "Ext Transfer"
  );

  if (entryCode) {
    setValue(
      elements.namedItem("entryCode") as HTMLInputElement,
      entryCode
    );
  }

  setValue(
    elements.namedItem("entryReason") as HTMLInputElement,
    "Ext Admit"
  );
}
