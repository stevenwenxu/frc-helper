import Button from "react-bootstrap/Button";
import { useMainContentType } from './main_content_context';
import { Student } from "../common/models/person";
import { SecondaryMathAssessment } from "../common/models/secondary_math_assessment";
import { defaultCourseCode } from "../common/models/secondary_math_exams";
import { useFamilyContext } from "./family_context";
import { FamilyRepository } from "../common/family_repository";
import { WritableDraft } from "immer";

export default function MathAssessmentButton() {
  const { setMainContentType } = useMainContentType();
  const {selectedFamilyId, selectedPeopleIndex, selectedPerson, setFamilies} = useFamilyContext();

  if (
    !selectedFamilyId ||
    selectedPeopleIndex === undefined
  ) {
    console.error("MathAssessmentButton: unexpected state", selectedFamilyId, selectedPeopleIndex);
    return null;
  }

  const onClick = () => {
    // The selected person is guaranteed to be a secondary student. Otherwise the button isn't visible.
    const student = selectedPerson as Student;

    if (student.secondaryMathAssessment) {
      setMainContentType("mathAssessment");
    } else {
      const courseCode = defaultCourseCode(parseInt(student.grade), "university");
      const assessment = new SecondaryMathAssessment(courseCode);
      setFamilies((draft) => {
        const familyDraft = draft.find((family) => family.uniqueId === selectedFamilyId)!;
        const studentDraft = familyDraft.people[selectedPeopleIndex] as WritableDraft<Student>;
        studentDraft.secondaryMathAssessment = assessment;
      });
      setMainContentType("mathAssessment");

      FamilyRepository.updateStudent(selectedFamilyId, selectedPeopleIndex, (student) => {
        student.secondaryMathAssessment = assessment;
        return Promise.resolve(student);
      });
    }
  }

  return (
    <Button
      variant="outline-secondary"
      className="flex-fill"
      onClick={onClick}
    >
      Math Assessment
    </Button>
  )
}
