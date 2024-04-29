import { FamilyRepository } from "../../common/family_repository";
import { Gender } from "../../common/models/gender";
import { Student } from "../../common/models/person";
import { StatusInCanada } from "../../common/models/status_in_canada";

export async function saveStudentDetails(familyId: string, personIndex: number) {
  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;
  const preferredFirstName = elements.namedItem("propertyValue(relStdPsnOid_psnNameFirst)") as HTMLInputElement | null;
  const preferredMiddleName = elements.namedItem("propertyValue(relStdPsnOid_psnNameMiddle)") as HTMLInputElement | null;
  const preferredLastName = elements.namedItem("propertyValue(relStdPsnOid_psnNameLast)") as HTMLInputElement | null;

  await FamilyRepository.updateStudent(familyId, personIndex, async (student) => {
    if (needsToConfirmChange(student)) {
      const response = await chrome.runtime.sendMessage<object, {confirmUpdateStudentName: boolean}>(
        {
          type: "confirmUpdateStudentName",
          oldName: student.fullName,
          newName: `${preferredFirstName!.value} ${preferredMiddleName!.value} ${preferredLastName!.value}`
        }
      );

      console.log("Confirm update student response:", response);
      if (response.confirmUpdateStudentName) {
        return updateStudentDetails(student);
      } else {
        return false;
      }
    } else {
      return updateStudentDetails(student);
    }
  });
}

function updateStudentDetails(student: Student) {
  console.log("Updating student with info from demographics page...");

  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;

  // Demographics
  const legalFirstName = elements.namedItem("propertyValue(relStdPsnOid_psnFieldC022)") as HTMLInputElement | null;
  const legalMiddleName = elements.namedItem("propertyValue(relStdPsnOid_psnFieldC023)") as HTMLInputElement | null;
  const legalLastName = elements.namedItem("propertyValue(relStdPsnOid_psnFieldC001)") as HTMLInputElement | null;
  const preferredFirstName = elements.namedItem("propertyValue(relStdPsnOid_psnNameFirst)") as HTMLInputElement | null;
  const preferredMiddleName = elements.namedItem("propertyValue(relStdPsnOid_psnNameMiddle)") as HTMLInputElement | null;
  const preferredLastName = elements.namedItem("propertyValue(relStdPsnOid_psnNameLast)") as HTMLInputElement | null;
  const dateOfBirth = elements.namedItem("propertyValue(relStdPsnOid_psnDob)") as HTMLInputElement | null;
  const gender = elements.namedItem("propertyValue(relStdPsnOid_psnGenderCode)") as HTMLSelectElement | null;
  const localId = elements.namedItem("propertyValue(stdIDLocal)") as HTMLInputElement | null;
  const grade = elements.namedItem("propertyValue(stdGradeLevel)") as HTMLSelectElement | null;
  const homeLanguage = elements.namedItem("propertyValue(stdHomeLang)") as HTMLSelectElement | null;
  const currentSchool = elements.namedItem("propertyValue(relStdSklOid_sklSchoolName)") as HTMLInputElement | null;
  const transferSchool = elements.namedItem("#propertyValue(stdSklOIDTrans)") as HTMLInputElement | null;
  const transferPending = elements.namedItem("prefixpropertyValue(stdTransferInd)") as HTMLInputElement | null;
  const nextYearSchool = elements.namedItem("#propertyValue(stdSklOIDNext)") as HTMLInputElement | null;

  // Citizenship
  const statusInCanada = elements.namedItem("propertyValue(relStdPsnOid_psnFieldA012)") as HTMLSelectElement | null;
  const countryOfBirth = elements.namedItem("propertyValue(relStdPsnOid_psnFieldB001)") as HTMLSelectElement | null;
  const countryOfLastResidence = elements.namedItem("propertyValue(relStdPsnOid_psnFieldB005)") as HTMLSelectElement | null;
  const dateOfEntryToCanada = elements.namedItem("propertyValue(relStdPsnOid_psnFieldA013)") as HTMLInputElement | null;

  if (legalFirstName) {
    student.legalFirstName = legalFirstName.value;
  }
  if (legalMiddleName) {
    student.legalMiddleName = legalMiddleName.value;
  }
  if (legalLastName) {
    student.legalLastName = legalLastName.value;
  }
  if (preferredFirstName) {
    student.firstName = preferredFirstName.value;
  }
  if (preferredMiddleName) {
    student.middleName = preferredMiddleName.value;
  }
  if (preferredLastName) {
    student.lastName = preferredLastName.value;
  }
  if (dateOfBirth) {
    student.dateOfBirth = dateOfBirth.value;
  }
  if (gender) {
    // TODO: this may need a confirmation dialog if value is unknown
    student.gender = gender.value as Gender;
  }
  if (localId) {
    student.localId = localId.value.replace(/^(\d{3})(\d{3})(\d{3})$/, "$1-$2-$3");
  }
  if (grade) {
    const gradeNum = parseInt(grade.value);
    student.demographicsGrade = isNaN(gradeNum) ? grade.value : `${gradeNum}`;
  }
  if (homeLanguage) {
    student.homeLanguage = homeLanguage.value;
  }
  if (currentSchool) {
    student.currentSchool = currentSchool.value;
  }
  if (transferSchool) {
    student.transferSchool = transferSchool.value;
  }
  if (transferPending) {
    student.pendingTransferChecked = transferPending.checked;
  }
  if (nextYearSchool) {
    student.nextYearSchool = nextYearSchool.value;
  }
  if (statusInCanada) {
    student.statusInCanada = statusInCanada.value as StatusInCanada;
  }
  if (countryOfBirth) {
    // `value` sometimes doesn't use the full country name
    student.countryOfBirth = countryOfBirth.selectedOptions[0].title;
  }
  if (countryOfLastResidence) {
    // `value` sometimes doesn't use the full country name
    student.countryOfLastResidence = countryOfLastResidence.selectedOptions[0].title;
  }
  if (dateOfEntryToCanada) {
    student.dateOfEntryToCanada = dateOfEntryToCanada.value;
  }

  return student;
}

function needsToConfirmChange(currentStudent: Student) {
  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;
  const preferredFirstName = elements.namedItem("propertyValue(relStdPsnOid_psnNameFirst)") as HTMLInputElement | null;
  const preferredMiddleName = elements.namedItem("propertyValue(relStdPsnOid_psnNameMiddle)") as HTMLInputElement | null;
  const preferredLastName = elements.namedItem("propertyValue(relStdPsnOid_psnNameLast)") as HTMLInputElement | null;

  if (!preferredFirstName || !preferredMiddleName || !preferredLastName) {
    return false;
  }

  const isNameDifferent = preferredFirstName.value !== currentStudent.firstName ||
    preferredMiddleName.value !== currentStudent.middleName ||
    preferredLastName.value !== currentStudent.lastName;

  return isNameDifferent;
}
