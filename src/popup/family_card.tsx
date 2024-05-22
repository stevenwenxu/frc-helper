import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table';
import { Parent, Student } from '../common/models/person';
import { SchoolCategory } from '../common/models/school_category';
import { StatusInCanada } from '../common/models/status_in_canada';
import OCDSB031Button from './ocdsb_031_button';
import StepButton from './step_button';
import { useFamilyContext } from './family_context';
import { useMainContentType } from './main_content_context';
import FillButton from './fill_button';
import MathAssessmentButton from './math_assessment_button';

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
  const { selectedFamily: family, selectedPeopleIndex } = useFamilyContext();
  const { setMainContentType } = useMainContentType();

  if (!family || selectedPeopleIndex === undefined) {
    console.error("FamilyCard.Body: unexpected empty state", family, selectedPeopleIndex);
    return null;
  }

  return (
    <TabContent>
      {family.people.map((person, index) => {
        const key = `person_${index}`;
        const notesStyle = {
          whiteSpace: "pre-wrap"
        };
        const isSecondaryStudent = person instanceof Student && person.schoolCategory === SchoolCategory.Secondary;
        const isOCDSB031Available = person instanceof Student && (
          person.statusInCanada === StatusInCanada.CanadianCitizen ||
          person.statusInCanada === StatusInCanada.PermanentResident
        );

        return (
          <TabPane key={key} eventKey={key} active={ key === `person_${selectedPeopleIndex}` }>
            <div className="d-flex gap-3 mb-3">
              <FillButton />
              { isSecondaryStudent && <MathAssessmentButton /> }
            </div>

            <Table>
              <tbody>
                <tr>
                  <th scope="row">First Name</th>
                  <td>{person.firstName}</td>
                </tr>
                <tr>
                  <th scope="row">Middle Name</th>
                  <td>{person.middleName}</td>
                </tr>
                <tr>
                  <th scope="row">Last Name</th>
                  <td>{person.lastName}</td>
                </tr>
                {person instanceof Parent && (
                  <tr>
                    <th scope="row">Email</th>
                    <td>{person.email}</td>
                  </tr>
                )}
                <tr>
                  <th scope="row">Phone</th>
                  <td>{person.phone}</td>
                </tr>
                <tr>
                  <th scope="row">Address</th>
                  <td>{person.address}</td>
                </tr>
                {person instanceof Parent && (
                  <tr>
                    <th scope="row">Parent notes</th>
                    <td style={notesStyle}>{person.parentNotes}</td>
                  </tr>
                )}
                {person instanceof Student && (
                  <>
                    <tr>
                      <th scope="row">Date of birth</th>
                      <td>{person.dateOfBirth}</td>
                    </tr>
                    <tr>
                      <th scope="row">Country of birth</th>
                      <td>{person.countryOfBirth}</td>
                    </tr>
                    <tr>
                      <th scope="row">Student notes</th>
                      <td style={notesStyle}>{person.studentNotes}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </Table>

            {person instanceof Student && (
              <div className="d-flex gap-3 mb-3">
                {isOCDSB031Available && (
                  <OCDSB031Button student={person} firstParent={family.parents[0] as Parent} />
                )}
                <StepButton student={person} />
                <Button
                  variant="outline-primary"
                  className="flex-fill"
                  onClick={() => { setMainContentType("email") }}
                >
                  Preview email
                </Button>
              </div>
            )}
          </TabPane>
        )
      })}
    </TabContent>
  );
}
