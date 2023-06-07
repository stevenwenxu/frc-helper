import { FamilyRepository } from "../../common/family_repository";
import { Gender } from "../../common/models/gender";
import { Student } from "../../common/models/person";

export async function saveStudentDetails(familyId: string, personIndex: number) {
  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;
  const preferredFirstName = elements.namedItem("propertyValue(relStdPsnOid_psnNameFirst)") as HTMLInputElement | null;
  const preferredMiddleName = elements.namedItem("propertyValue(relStdPsnOid_psnNameMiddle)") as HTMLInputElement | null;
  const preferredLastName = elements.namedItem("propertyValue(relStdPsnOid_psnNameLast)") as HTMLInputElement | null;

  await FamilyRepository.updateStudent(familyId, personIndex, async (student) => {
    if (needsToConfirmChange(student)) {
      const response = await chrome.runtime.sendMessage<Object, {confirmUpdateStudentName: boolean}>(
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
    student.localId = localId.value;
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
