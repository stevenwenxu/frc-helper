import { FamilyRepository } from "../../common/family_repository";

export async function saveStudentDetails(familyId: string, personIndex: number) {
  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;

  const localId = elements.namedItem("propertyValue(stdIDLocal)") as HTMLInputElement | null;
  const grade = elements.namedItem("propertyValue(stdGradeLevel)") as HTMLSelectElement | null;
  const homeLanguage = elements.namedItem("propertyValue(stdHomeLang)") as HTMLSelectElement | null;
  const currentSchool = elements.namedItem("propertyValue(relStdSklOid_sklSchoolName)") as HTMLInputElement | null;
  const transferSchool = elements.namedItem("#propertyValue(stdSklOIDTrans)") as HTMLInputElement | null;
  const transferPending = elements.namedItem("prefixpropertyValue(stdTransferInd)") as HTMLInputElement | null;

  await FamilyRepository.updateStudent(familyId, personIndex, (student) => {
    if (localId) {
      student.localId = localId.value;
    }
    if (grade) {
      const gradeNum = parseInt(grade.value);
      student.grade = isNaN(gradeNum) ? grade.value : `${gradeNum}`;
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

    return student;
  });
}
