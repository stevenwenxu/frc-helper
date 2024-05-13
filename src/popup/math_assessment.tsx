import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import { useMainContentType } from './main_content_context';
import { useFamilyContext } from './family_context';
import { Student } from '../common/models/person';
import { SecondaryMathExams } from '../common/models/secondary_math_exams';
import { SecondaryMathTasks } from '../common/models/secondary_math_tasks';

export default function MathAssessment() {
  const { setMainContentType } = useMainContentType();
  const {selectedFamilyId, selectedPeopleIndex, selectedPerson: student} = useFamilyContext();

  if (
    !selectedFamilyId ||
    selectedPeopleIndex === undefined ||
    !student ||
    !(student instanceof Student) ||
    !student.secondaryMathAssessment
  ) {
    console.error("MathAssessment: unexpected state", selectedFamilyId, selectedPeopleIndex, student);
    return null;
  }

  const assessment = student.secondaryMathAssessment;

  return (
    <>
      <CloseButton onClick={() => { setMainContentType("family") }} />

      <h4>Secondary Math Assessment: {student.fullName}</h4>

      <Card className="mb-4">
        <Card.Header>Configuration</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group as={Row} className="align-items-center mb-2">
              <Col xs={4}>Diagnostic Tasks</Col>
              <Col xs={8}>
                {SecondaryMathTasks.diagnosticTasks.map((task) => {
                  const id = `diagnostic${task}`;
                  const value = `Diagnostic Task ${task}`;
                  const checked = assessment.diagnosticTasks.includes(value);
                  return (
                    <Form.Check
                      inline
                      id={id}
                      key={id}
                      type="checkbox"
                      name="diagnosticTask"
                      value={value}
                      defaultChecked={checked}
                      label={task}
                    />
                  );
                })}
              </Col>
            </Form.Group>

            <Row className="mb-2">
              <FloatingLabel as={Col} xs={12} controlId="courseCode" label="Course" className="g-2">
                <Form.Select defaultValue={assessment.courseCode}>
                  {Object.entries(SecondaryMathExams).map(([courseCode, {gradeLevel}]) => {
                    if (gradeLevel === 8) {
                      return null;
                    } else {
                      return (
                        <option key={courseCode} value={courseCode}>
                          Grade {gradeLevel}: {courseCode}
                        </option>
                      )
                    }
                  })}
                </Form.Select>
              </FloatingLabel>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
