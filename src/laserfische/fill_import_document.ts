import { setValue } from "../common/helpers/fill_helper";
import { SchoolHelper } from "../common/helpers/school_helper";
import { Student } from "../common/models/person";

export function fillImportDocument(student: Student) {
  // Need another selector before #fieldPaneDisplay because there are two divs with the same id...
  const formElements = document.querySelector("div.modal-dialog #fieldPaneDisplay > form > section.templateFields > div.section-body > lf-modern-renderer")!.shadowRoot!;

  const firstName = (formElements
    .querySelector("div > div:nth-child(1) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-single-line")?.shadowRoot
    ?.querySelector("div > div > div.single-line-input-wrapper.single-line-textarea-container > textarea")
    ?? null) as HTMLInputElement | null;
  const lastName = (formElements
    .querySelector("div > div:nth-child(2) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-single-line")?.shadowRoot
    ?.querySelector("div > div > div.single-line-input-wrapper.single-line-textarea-container > textarea")
    ?? null) as HTMLInputElement | null;
  const dateOfBirth = (formElements
    .querySelector("div > div:nth-child(3) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-date-time")?.shadowRoot
    ?.querySelector("div > div > div > input.datetime-input.field-input")
    ?? null) as HTMLInputElement | null;
  const schoolYear = (formElements
    .querySelector("div > div:nth-child(4) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-dropdown")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-field-select > lf-dropdown-with-filter")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-select-container > select")
    ?? null) as HTMLInputElement | null;
  const grade = (formElements
    .querySelector("div > div:nth-child(5) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-dropdown")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-field-select > lf-dropdown-with-filter")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-select-container > select")
    ?? null) as HTMLInputElement | null;
  const legalName = (formElements
    .querySelector("div > div:nth-child(6) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-single-line")?.shadowRoot
    ?.querySelector("div > div > div.single-line-input-wrapper.single-line-textarea-container > textarea")
    ?? null) as HTMLInputElement | null;
  const schoolName = (formElements
    .querySelector("div > div:nth-child(7) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-dropdown")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-field-select > lf-dropdown-with-filter")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-select-container > select")
    ?? null) as HTMLInputElement | null;
  const aspenProfileCreated = (formElements
    .querySelector("div > div:nth-child(8) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-dropdown")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-field-select > lf-dropdown-with-filter")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-select-container > select")
    ?? null) as HTMLInputElement | null;
  const studentNumber = (formElements
    .querySelector("div > div:nth-child(9) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-single-line")?.shadowRoot
    ?.querySelector("div > div > div.single-line-input-wrapper > input")
    ?? null) as HTMLInputElement | null;
  const permitCreated = (formElements
    .querySelector("div > div:nth-child(10) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-dropdown")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-field-select > lf-dropdown-with-filter")?.shadowRoot
    ?.querySelector("div > div > div.dropdown-select-container > select")
    ?? null) as HTMLInputElement | null;
  const assessor = (formElements
    .querySelector("div > div:nth-child(13) > div > lf-single-field")?.shadowRoot
    ?.querySelector("div > div > div > lf-single-line")?.shadowRoot
    ?.querySelector("div > div > div.single-line-input-wrapper.single-line-textarea-container > textarea")
    ?? null) as HTMLInputElement | null;;

  setValue(firstName, student.firstName);
  setValue(lastName, student.lastName);
  setValue(
    dateOfBirth,
    new Date(student.dateOfBirth).toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" })
  );
  setValue(schoolYear, student.schoolYear);
  setValue(grade, student.grade);
  if (shouldFillLegalName(student)) {
    setValue(legalName, student.legalFullName);
  }
  setValue(schoolName, SchoolHelper.aspenNameToLaserfischeName(student.targetSchool));
  setValue(aspenProfileCreated, "Yes");
  setValue(studentNumber, student.localId);
  setValue(permitCreated, "Yes");
  setValue(assessor, "Kate Cao");
}

function shouldFillLegalName(student: Student) {
  // Ignore middle name
  return student.legalFirstName !== student.firstName || student.legalLastName !== student.lastName;
}
