import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';
import { Parent, Student } from '../common/models/person';
import { SchoolCategory } from '../common/models/school_category';
import { StatusInCanada } from '../common/models/status_in_canada';
import OCDSB031Button from './ocdsb_031_button';
import StepButton from './step_button';
import { useFamilyContext } from './family_context';
import FillButton from './fill_button';
import MathAssessmentButton from './math_assessment_button';
import EmailButton from './email_button';

export default function FamilyCard() {

  return (
    <Card>
      <Card.Header>
        <Header />
      </Card.Header>
      <Card.Body>
        <Body />
      </Card.Body>
    </Card>
  )
}

function Header() {
  const { selectedFamily: family, selectedPeopleIndex, setSelectedPeopleIndex } = useFamilyContext();

  if (!family || selectedPeopleIndex === undefined) {
    console.error("FamilyCard.Header: unexpected empty state", family, selectedPeopleIndex);
    return null;
  }

  let parentIndex = 1;
  const activeKey = `person_${selectedPeopleIndex}`;
  const onSelect = (key: string | null) => {
    if (key) {
      setSelectedPeopleIndex(Number(key.split("_")[1]));
    }
  }

  return (
    <Nav
      variant="tabs"
      activeKey={activeKey}
      onSelect={onSelect}
    >
      {family.people.map((person, index) => {
        const displayName = person instanceof Student ? person.firstNameWithGrade : `Parent ${parentIndex++}`;
        const key = `person_${index}`;
        return (
          <Nav.Item key={key}>
            <Nav.Link eventKey={key}>{displayName}</Nav.Link>
          </Nav.Item>
        );
      })}
    </Nav>
  );
}

function Body() {
  const { selectedFamily: family, selectedPerson } = useFamilyContext();

  if (!family || selectedPerson === undefined) {
    console.error("FamilyCard.Body: unexpected empty state", family, selectedPerson);
    return null;
  }

  const notesStyle = {
    whiteSpace: "pre-wrap"
  };

  const isSecondaryStudent = selectedPerson instanceof Student &&
    selectedPerson.schoolCategory === SchoolCategory.Secondary;
  const isOCDSB031Available = selectedPerson instanceof Student && (
    selectedPerson.statusInCanada === StatusInCanada.CanadianCitizen ||
    selectedPerson.statusInCanada === StatusInCanada.PermanentResident
  );

  return <>
    <div className="d-flex gap-3 mb-3">
      <FillButton />
      { isSecondaryStudent && <MathAssessmentButton /> }
    </div>

    <Table>
      <tbody>
        <tr>
          <th scope="row">First Name</th>
          <td>{selectedPerson.firstName}</td>
        </tr>
        <tr>
          <th scope="row">Middle Name</th>
          <td>{selectedPerson.middleName}</td>
        </tr>
        <tr>
          <th scope="row">Last Name</th>
          <td>{selectedPerson.lastName}</td>
        </tr>
        {selectedPerson instanceof Parent && (
          <tr>
            <th scope="row">Email</th>
            <td>{selectedPerson.email}</td>
          </tr>
        )}
        <tr>
          <th scope="row">Phone</th>
          <td>{selectedPerson.phone}</td>
        </tr>
        <tr>
          <th scope="row">Address</th>
          <td>{selectedPerson.address}</td>
        </tr>
        {selectedPerson instanceof Parent && (
          <tr>
            <th scope="row">Parent notes</th>
            <td style={notesStyle}>{selectedPerson.parentNotes}</td>
          </tr>
        )}
        {selectedPerson instanceof Student && (
          <>
            <tr>
              <th scope="row">Date of birth</th>
              <td>{selectedPerson.dateOfBirth}</td>
            </tr>
            <tr>
              <th scope="row">Country of birth</th>
              <td>{selectedPerson.countryOfBirth}</td>
            </tr>
            <tr>
              <th scope="row">Student notes</th>
              <td style={notesStyle}>{selectedPerson.studentNotes}</td>
            </tr>
          </>
        )}
      </tbody>
    </Table>

    {selectedPerson instanceof Student && (
      <div className="d-flex gap-3 mb-3">
        {isOCDSB031Available && (
          <OCDSB031Button />
        )}
        <StepButton />
        <EmailButton />
      </div>
    )}
  </>;
}
