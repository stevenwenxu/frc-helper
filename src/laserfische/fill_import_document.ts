import { setValue } from "../common/helpers/fill_helper";
import { SchoolHelper } from "../common/helpers/school_helper";
import { Student } from "../common/models/person";

export function fillImportDocument(student: Student) {
  // Need another selector before #fieldPaneDisplay because there are two divs with the same id...
  const formElements = document.querySelector("div.modal-dialog #fieldPaneDisplay > form > div.templateFields > div:nth-child(3) > div")!;
  const firstName = formElements.querySelector("div:nth-child(1) > div.textarea > div > div.fieldInput > div > textarea") as HTMLInputElement | null;
  const lastName = formElements.querySelector("div:nth-child(2) > div.textarea > div > div.fieldInput > div > textarea") as HTMLInputElement | null;
  const dateOfBirth = formElements.querySelector("div:nth-child(3) > div:nth-child(2) > div > div.fieldInput > form > div > input") as HTMLInputElement | null;
  const schoolYear = formElements.querySelector("div:nth-child(4) > div:nth-child(2) > div > div > form > div:nth-child(1) > select") as HTMLInputElement | null;
  const grade = formElements.querySelector("div:nth-child(5) > div:nth-child(2) > div > div > form > div:nth-child(1) > select") as HTMLInputElement | null;
  const legalName = formElements.querySelector("div:nth-child(6) > div.textarea > div > div.fieldInput > div > textarea") as HTMLInputElement | null;
  const schoolName = formElements.querySelector("div:nth-child(7) > div:nth-child(2) > div > div > form > div:nth-child(1) > select") as HTMLInputElement | null;
  const aspenProfileCreated = formElements.querySelector("div:nth-child(8) > div:nth-child(2) > div > div > form > div:nth-child(1) > select") as HTMLInputElement | null;
  const studentNumber = formElements.querySelector("div:nth-child(9) > div:nth-child(2) > div > div.fieldInput > div > input") as HTMLInputElement | null;
  const permitCreated = formElements.querySelector("div:nth-child(10) > div:nth-child(2) > div > div > form > div:nth-child(1) > select") as HTMLInputElement | null;
  const assessor = formElements.querySelector("div:nth-child(13) > div.textarea > div > div.fieldInput > div > textarea") as HTMLInputElement | null;

  setValue(firstName, student.firstName);
  setValue(lastName, student.lastName);
  setValue(
    dateOfBirth,
    new Date(student.dateOfBirth).toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" })
  );
  // Allows the form to run formatting on the date
  dateOfBirth?.dispatchEvent(new Event("blur"));
  if (shouldFillLegalName(student)) {
    setValue(legalName, student.legalFullName);
  }
  setValue(studentNumber, student.localId);
  setValue(assessor, "Kate Cao");

  // The following fields need a mouseover event to trigger an XHR request to populate the select options

  schoolYear?.dispatchEvent(new Event("mouseover"));
  setTimeout(() => {
    setValue(schoolYear, `string:${student.schoolYear}`);
  }, 1000);

  grade?.dispatchEvent(new Event("mouseover"));
  setTimeout(() => {
    setValue(grade, `string:${student.grade}`);
  }, 1000);

  schoolName?.dispatchEvent(new Event("mouseover"));
  setTimeout(() => {
    setValue(schoolName, `string:${SchoolHelper.fullSchoolName(student.targetSchool)}`);
  }, 1000);

  aspenProfileCreated?.dispatchEvent(new Event("mouseover"));
  setTimeout(() => {
    setValue(aspenProfileCreated, "string:Yes");
  }, 1000);

  permitCreated?.dispatchEvent(new Event("mouseover"));
  setTimeout(() => {
    setValue(permitCreated, "string:Yes");
  }, 1000);
}

function shouldFillLegalName(student: Student) {
  // Ignore middle name
  return student.legalFirstName !== student.firstName || student.legalLastName !== student.lastName;
}
