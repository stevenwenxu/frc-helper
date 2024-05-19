import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import CloseButton from 'react-bootstrap/CloseButton';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Stack from 'react-bootstrap/Stack';
import { WritableDraft } from 'immer';
import { Updater, useImmer } from 'use-immer';
import { useMainContentType } from './main_content_context';
import { useFamilyContext } from './family_context';
import { Student } from '../common/models/person';
import { SecondaryMathExams } from '../common/models/secondary_math_exams';
import { SecondaryMathTasks } from '../common/models/secondary_math_tasks';
import { FRCTrackerMathFields } from '../aspen/helpers/frc_tracker_math_fields';
import { FamilyRepository } from '../common/family_repository';
import { SecondaryMathAssessmentGrade } from '../common/models/secondary_math_assessment';

interface ComponentProps {
  student: Student;
  setStudent: Updater<Student>;
}

export default function MathAssessment() {
  const { setMainContentType } = useMainContentType();
  const {selectedFamilyId, selectedPeopleIndex, selectedPerson: initialStudent} = useFamilyContext();
  const [student, setStudent] = useImmer(initialStudent as Student);

  if (
    !selectedFamilyId ||
    selectedPeopleIndex === undefined ||
    !initialStudent ||
    !(initialStudent instanceof Student) ||
    !initialStudent.secondaryMathAssessment
  ) {
    console.error("MathAssessment: unexpected state", selectedFamilyId, selectedPeopleIndex, initialStudent);
    return null;
  }

  return (
    <>
      <CloseButton onClick={() => { setMainContentType("family") }} />
      <h4>Secondary Math Assessment: {student.fullName}</h4>
      <ConfigurationCard student={student} setStudent={setStudent} />
      <MathObservationsCard student={student} setStudent={setStudent} />
    </>
  )
}

function ConfigurationCard(props: ComponentProps) {
  return (
    <Card className="mb-4">
      <Card.Header>Configuration</Card.Header>
      <Card.Body>
        <Form>
          <DiagnosticTasks {...props} />
          <CourseCodeSelector {...props} />
          <GradingTable {...props} />
          <OutcomeSelector {...props} />
        </Form>
      </Card.Body>
  </Card>
  );
}

function DiagnosticTasks({student, setStudent}: ComponentProps) {
  const familyContext = useFamilyContext();
  const assessment = student.secondaryMathAssessment!;

  const mutateStudent = (aStudent: Student | WritableDraft<Student>, changedValue: string) => {
    const diagnosticTasks = aStudent.secondaryMathAssessment!.diagnosticTasks;
    if (diagnosticTasks.includes(changedValue)) {
      diagnosticTasks.splice(diagnosticTasks.indexOf(changedValue), 1);
    } else {
      diagnosticTasks.push(changedValue);
    }
    diagnosticTasks.sort();
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setStudent((draft) => mutateStudent(draft, value));

    FamilyRepository.updateStudent(familyContext.selectedFamilyId!, familyContext.selectedPeopleIndex!, (aStudent) => {
      mutateStudent(aStudent, value);
      return Promise.resolve(aStudent);
    });
  };

  return (
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
              checked={checked}
              onChange={onChange}
              label={task}
            />
          );
        })}
      </Col>
    </Form.Group>
  );
}

function CourseCodeSelector({student, setStudent}: ComponentProps) {
  const familyContext = useFamilyContext();
  const assessment = student.secondaryMathAssessment!;

  const mutateStudent = (aStudent: Student | WritableDraft<Student>, changedValue: string) => {
    aStudent.secondaryMathAssessment!.courseCode = changedValue;
    aStudent.secondaryMathAssessment!.gradingTable.P = [];
    aStudent.secondaryMathAssessment!.gradingTable.S = [];
    aStudent.secondaryMathAssessment!.gradingTable.L = [];
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    setStudent((draft) => mutateStudent(draft, value));

    FamilyRepository.updateStudent(familyContext.selectedFamilyId!, familyContext.selectedPeopleIndex!, (aStudent) => {
      mutateStudent(aStudent, value);
      return Promise.resolve(aStudent);
    });
  };

  return (
    <Row className="mb-2">
      <FloatingLabel as={Col} xs={12} controlId="courseCode" label="Course" className="g-2">
        <Form.Select value={assessment.courseCode} onChange={onChange}>
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
  );
}

function GradingTable({student, setStudent}: ComponentProps) {
  const familyContext = useFamilyContext();
  const assessment = student.secondaryMathAssessment!;
  const topicsAndQuestions = SecondaryMathExams[assessment.courseCode].exams[0].topicsAndQuestions;

  const mutateStudent = (
    aStudent: Student | WritableDraft<Student>,
    topic: string,
    grade: SecondaryMathAssessmentGrade
  ) => {
    const gradingTable = aStudent.secondaryMathAssessment!.gradingTable;

    // Remove topic from old grades.
    SecondaryMathAssessmentGrade.forEach((grade) => {
      const index = gradingTable[grade].indexOf(topic);
      if (index > -1) {
        gradingTable[grade].splice(index, 1);
      }
    });
    // Add topic to the new grade.
    gradingTable[grade].push(topic);
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const topic = event.target.name;
    const grade = event.target.value as SecondaryMathAssessmentGrade;

    setStudent((draft) => mutateStudent(draft, topic, grade));

    FamilyRepository.updateStudent(familyContext.selectedFamilyId!, familyContext.selectedPeopleIndex!, (aStudent) => {
      mutateStudent(aStudent, topic, grade);
      return Promise.resolve(aStudent);
    });
  };

  return (
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
                        checked={pChecked}
                        onChange={onChange}
                      >
                        P
                      </ToggleButton>
                      <ToggleButton
                        id={`topic${index}S`}
                        type="radio"
                        variant="outline-warning"
                        name={topic}
                        value="S"
                        checked={sChecked}
                        onChange={onChange}
                      >
                        S
                      </ToggleButton>
                      <ToggleButton
                        id={`topic${index}L`}
                        type="radio"
                        variant="outline-danger"
                        name={topic}
                        value="L"
                        checked={lChecked}
                        onChange={onChange}
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
  );
}

function OutcomeSelector({student, setStudent}: ComponentProps) {
  const familyContext = useFamilyContext();
  const assessment = student.secondaryMathAssessment!;

  const mutateStudent = (aStudent: Student | WritableDraft<Student>, newValue: string) => {
    aStudent.secondaryMathAssessment!.passed = newValue === "1";
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    setStudent((draft) => mutateStudent(draft, value));

    FamilyRepository.updateStudent(familyContext.selectedFamilyId!, familyContext.selectedPeopleIndex!, (aStudent) => {
      mutateStudent(aStudent, value);
      return Promise.resolve(aStudent);
    });
  };

  return (
    <Row className="mb-2">
      <FloatingLabel as={Col} xs={12} controlId="outcome" label="Outcome" className="g-2">
        <Form.Select value={assessment.passed ? "1" : "0"} onChange={onChange}>
          <option value="1">Passed</option>
          <option value="0">Failed</option>
        </Form.Select>
      </FloatingLabel>
    </Row>
  );
}

function MathObservationsCard({student}: ComponentProps) {
  return (
    <Card>
      <Card.Header>Math Observations</Card.Header>
      <Card.Body>
        <Card.Text style={{whiteSpace: "pre-wrap"}}>
          {FRCTrackerMathFields.mathObservations(student)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
