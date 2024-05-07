import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table';
import { Family } from '../common/models/family';
import { Parent, Student } from '../common/models/person';
import { SchoolCategory } from '../common/models/school_category';
import { StatusInCanada } from '../common/models/status_in_canada';

interface FamilyCardProps {
  family: Family;
}

interface HeaderProps {
  family: Family;
  selectedPersonKey: string;
  setSelectedPersonKey: (key: string) => void;
}

interface BodyProps {
  family: Family;
  selectedPersonKey: string;
}

export default function FamilyCard({family}: FamilyCardProps) {
  const [selectedPersonKey, setSelectedPersonKey] = useState("person_0");

  return (
    <Card>
      <Card.Header>
        <Header
          family={family}
          selectedPersonKey={selectedPersonKey}
          setSelectedPersonKey={setSelectedPersonKey}
        />
      </Card.Header>
      <Card.Body>
        <Body family={family} selectedPersonKey={selectedPersonKey} />
      </Card.Body>
    </Card>
  )
}

function Header({family, selectedPersonKey, setSelectedPersonKey}: HeaderProps) {
  let parentIndex = 1;

  return (
    <Nav
      variant="tabs"
      activeKey={selectedPersonKey}
      onSelect={(key) => { setSelectedPersonKey(key ?? "person_0") }}
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

function Body({family, selectedPersonKey}: BodyProps) {
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
          <TabPane key={key} eventKey={key} active={selectedPersonKey === key}>
            <div className="d-flex gap-3 mb-3">
              <Button
                variant="outline-primary"
                className="flex-fill"
              >
                Fill
              </Button>
              {isSecondaryStudent && (
                <Button
                  variant="outline-secondary"
                  className="flex-fill"
                >
                  Math Assessment
                </Button>
              )}
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
                  <Button
                    variant="outline-primary"
                    className="flex-fill"
                  >
                    <svg width="16" height="16" fill="currentColor">
                      <use href="/images/download.svg#download-svg"/>
                    </svg>
                    OCDSB 031
                  </Button>
                )}
                <Button
                  variant="outline-primary"
                  className="flex-fill"
                >
                  <svg width="16" height="16" fill="currentColor">
                    <use href="/images/download.svg#download-svg"/>
                  </svg>
                  STEP
                </Button>
                <Button
                  variant="outline-primary"
                  className="flex-fill"
                >
                  Generate email
                </Button>
              </div>
            )}
          </TabPane>
        )
      })}
    </TabContent>
  );
}
