import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import CloseButton from 'react-bootstrap/CloseButton';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Stack from 'react-bootstrap/Stack';
import { useMainContentType } from './main_content_context';
import { useFamilyContext } from './family_context';
import { Student } from '../common/models/person';
import { SecondaryMathExams } from '../common/models/secondary_math_exams';
import { SecondaryMathTasks } from '../common/models/secondary_math_tasks';
import { FRCTrackerMathFields } from '../aspen/helpers/frc_tracker_math_fields';

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
  const topicsAndQuestions = SecondaryMathExams[assessment.courseCode].exams[0].topicsAndQuestions;

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

            <Row className="mb-2">
              <Col xs={12} className="g-2">
                <Table bordered className="text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Topic</th>
                      <th scope="col">Questions</th>
                      <th scope="col">Proficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(topicsAndQuestions).map(([topic, questions], index) => {
                      const pChecked = assessment.gradingTable["P"].includes(topic);
                      const sChecked = assessment.gradingTable["S"].includes(topic);
                      const lChecked = assessment.gradingTable["L"].includes(topic);
                      return (
                        <tr key={topic}>
                          <td>{topic}</td>
                          <td>{questions.join(", ")}</td>
                          <td>
                            <Stack direction="horizontal" gap={1} className="justify-content-around">
                              <ToggleButton
                                id={`topic${index}P`}
                                type="radio"
                                variant="outline-success"
                                name={topic}
                                value="P"
                                defaultChecked={pChecked}
                              >
                                P
                              </ToggleButton>
                              <ToggleButton
                                id={`topic${index}S`}
                                type="radio"
                                variant="outline-warning"
                                name={topic}
                                value="S"
                                defaultChecked={sChecked}
                              >
                                S
                              </ToggleButton>
                              <ToggleButton
                                id={`topic${index}L`}
                                type="radio"
                                variant="outline-danger"
                                name={topic}
                                value="L"
                                defaultChecked={lChecked}
                              >
                                L
                              </ToggleButton>
                            </Stack>
                          </td>
                        </tr>
                        )
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>

            <Row className="mb-2">
              <FloatingLabel as={Col} xs={12} controlId="outcome" label="Outcome" className="g-2">
                <Form.Select defaultValue={assessment.passed ? "1" : "0"}>
                  <option value="1">Passed</option>
                  <option value="0">Failed</option>
                </Form.Select>
              </FloatingLabel>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Math Observations</Card.Header>
        <Card.Body>
          <Card.Text style={{whiteSpace: "pre-wrap"}}>
            {FRCTrackerMathFields.mathObservations(student)}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}
