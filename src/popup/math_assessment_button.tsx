import Button from "react-bootstrap/Button";
import { useMainContentType } from './main_content_context';
import { Student } from "../common/models/person";
import { SecondaryMathAssessment } from "../common/models/secondary_math_assessment";
import { defaultCourseCode } from "../common/models/secondary_math_exams";
import { useFamilyContext } from "./family_context";
import { FamilyRepository } from "../common/family_repository";

export default function MathAssessmentButton() {
  const { setMainContentType } = useMainContentType();
  const {selectedFamilyId, selectedPeopleIndex, selectedPerson: student} = useFamilyContext();

  if (
    !selectedFamilyId ||
    selectedPeopleIndex === undefined ||
    !student ||
    !(student instanceof Student)
  ) {
    console.error("MathAssessmentButton: unexpected state", selectedFamilyId, selectedPeopleIndex, student);
    return null;
  }

  const onClick = () => {
    if (student.secondaryMathAssessment) {
      setMainContentType("mathAssessment");
    } else {
      const courseCode = defaultCourseCode(parseInt(student.grade), "university");
      const assessment = new SecondaryMathAssessment(courseCode);

      FamilyRepository.updateStudent(selectedFamilyId, selectedPeopleIndex, (student) => {
        student.secondaryMathAssessment = assessment;
        return Promise.resolve(student);
      }).then(() => {
        setMainContentType("mathAssessment");
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
