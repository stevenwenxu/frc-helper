import Tab from "react-bootstrap/Tab";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Family } from "../common/models/family";
import { Parent, Student } from "../common/models/person";
import { FamilyRepository } from "../common/family_repository";
import { Updater } from "use-immer";
import { WritableDraft } from "immer";

interface SidePanelTabContentProps {
  family: Family;
  setFamily: Updater<Family | null>;
}

interface PersonFormProps {
  family: Family;
  setFamily: Updater<Family | null>;
  peopleIndex: number;
  personKey: string;
}

export default function SidePanelTabContent({family, setFamily}: SidePanelTabContentProps) {
  let parentIndex = 1;
  let studentIndex = 1;

  return (
    <Tab.Content>
      {family.people.map((person, peopleIndex) => {
        const eventKey = person instanceof Student ? `student_${studentIndex++}` : `parent_${parentIndex++}`;

        return (
          <Tab.Pane key={eventKey} eventKey={eventKey}>
            <PersonForm
              family={family}
              setFamily={setFamily}
              peopleIndex={peopleIndex}
              personKey={eventKey}
            />
          </Tab.Pane>
        )
      })}
    </Tab.Content>
  )
}

function PersonForm({family, setFamily, peopleIndex, personKey}: PersonFormProps) {
  const person = family.people[peopleIndex];
  const inputStyle = {
    backgroundColor: "var(--bs-form-control-bg)",
    border: "var(--bs-border-width) solid var(--bs-border-color)",
    maxWidth: "initial"
  };
  const textAreaStyle = {
    height: "120px"
  };
  const checkboxStyle = {
    width: "1em",
    marginTop: "0.25em"
  };

  return (
    <Form autoComplete="off">
      <FloatingLabel label="First name" controlId={`${personKey}_firstName`}>
        <Form.Control
          className="mb-2"
          type="text"
          placeholder="firstName"
          name="firstName"
          value={person.firstName}
          onChange={(e) => {
            setFamily((draft) => {
              updatePerson(draft!, peopleIndex, e.target.name, e.target.value);
            });
          }}
          onBlur={() => { FamilyRepository.saveFamily(family) }}
          style={inputStyle}
        />
      </FloatingLabel>

      <FloatingLabel label="Middle name" controlId={`${personKey}_middleName`}>
        <Form.Control
          className="mb-2"
          type="text"
          placeholder="middleName"
          name="middleName"
          value={person.middleName}
          onChange={(e) => {
            setFamily((draft) => {
              updatePerson(draft!, peopleIndex, e.target.name, e.target.value);
            });
          }}
          onBlur={() => { FamilyRepository.saveFamily(family) }}
          style={inputStyle}
        />
      </FloatingLabel>

      <FloatingLabel label="Last name" controlId={`${personKey}_lastName`}>
        <Form.Control
          className="mb-2"
          type="text"
          placeholder="lastName"
          name="lastName"
          value={person.lastName}
          onChange={(e) => {
            setFamily((draft) => {
              updatePerson(draft!, peopleIndex, e.target.name, e.target.value);
            });
          }}
          onBlur={() => { FamilyRepository.saveFamily(family) }}
          style={inputStyle}
        />
      </FloatingLabel>

      {person instanceof Parent && (
        <FloatingLabel label="Email" controlId={`${personKey}_email`}>
          <Form.Control
            className="mb-2"
            type="email"
            placeholder="email"
            name="email"
            value={person.email}
            onChange={(e) => {
              setFamily((draft) => {
                updatePerson(draft!, peopleIndex, e.target.name, e.target.value);
              });
            }}
            onBlur={() => { FamilyRepository.saveFamily(family) }}
            style={inputStyle}
          />
        </FloatingLabel>
      )}

      <FloatingLabel label="Phone" controlId={`${personKey}_phone`}>
        <Form.Control
          className="mb-2"
          type="tel"
          placeholder="phone"
          name="phone"
          value={person.phone}
          onChange={(e) => {
            setFamily((draft) => {
              updatePerson(draft!, peopleIndex, e.target.name, e.target.value);
            });
          }}
          onBlur={() => { FamilyRepository.saveFamily(family) }}
          style={inputStyle}
        />
      </FloatingLabel>

      <Row className="mb-2 align-items-center">
        <Col>
          <FloatingLabel label="Address" controlId={`${personKey}_address`}>
            <Form.Control
              type="text"
              placeholder="address"
              name="address"
              value={person.address}
              onChange={(e) => {
                setFamily((draft) => {
                  updateAddress(draft!, peopleIndex, e.target.value)
                });
              }}
              onBlur={() => { FamilyRepository.saveFamily(family) }}
              style={inputStyle}
            />
          </FloatingLabel>
        </Col>
        <Col md="auto" style={{paddingLeft: 0}}>
          <Form.Check id={`${personKey}_unique`} type="checkbox">
            <Form.Check.Input
              type="checkbox"
              style={checkboxStyle}
              name="isAddressUnique"
              checked={person.isAddressUnique}
              onChange={(e) => {
                setFamily((draft) => {
                  updatePerson(draft!, peopleIndex, e.target.name, e.target.checked ? "on" : "off")
                });
                FamilyRepository.saveFamily(family);
              }}
            />
            <Form.Check.Label>Unique</Form.Check.Label>
          </Form.Check>
        </Col>
      </Row>

      {person instanceof Parent && (
        <FloatingLabel label="Parent notes" controlId={`${personKey}_parentNotes`}>
          <Form.Control
            className="mb-2"
            as="textarea"
            placeholder="parentNotes"
            name="parentNotes"
            value={person.parentNotes}
            onChange={(e) => {
              setFamily((draft) => {
                updatePerson(draft!, peopleIndex, e.target.name, e.target.value);
              });
            }}
            onBlur={() => { FamilyRepository.saveFamily(family) }}
            style={textAreaStyle}
          />
        </FloatingLabel>
      )}

      {person instanceof Student && (
        <>
          <FloatingLabel label="Date of birth" controlId={`${personKey}_dateOfBirth`}>
            <Form.Control
              className="mb-2"
              type="text"
              placeholder="dateOfBirth"
              name="dateOfBirth"
              value={person.dateOfBirth}
              onChange={(e) => {
                setFamily((draft) => {
                  updatePerson(draft!, peopleIndex, e.target.name, e.target.value);
                });
              }}
              onBlur={() => { FamilyRepository.saveFamily(family) }}
              style={inputStyle}
            />
          </FloatingLabel>

          <FloatingLabel label="Country of birth" controlId={`${personKey}_countryOfBirth`}>
            <Form.Control
              className="mb-2"
              type="text"
              placeholder="countryOfBirth"
              name="countryOfBirth"
              value={person.countryOfBirth}
              onChange={(e) => {
                setFamily((draft) => {
                  updatePerson(draft!, peopleIndex, e.target.name, e.target.value);
                });
              }}
              onBlur={() => { FamilyRepository.saveFamily(family) }}
              style={inputStyle}
            />
          </FloatingLabel>

          <FloatingLabel label="Student notes" controlId={`${personKey}_studentNotes`}>
            <Form.Control
              className="mb-2"
              as="textarea"
              placeholder="studentNotes"
              name="studentNotes"
              value={person.studentNotes}
              onChange={(e) => {
                setFamily((draft) => {
                  updatePerson(draft!, peopleIndex, e.target.name, e.target.value);
                });
              }}
              onBlur={() => { FamilyRepository.saveFamily(family) }}
              style={textAreaStyle}
            />
          </FloatingLabel>
        </>
      )}
    </Form>
  )
}

function updatePerson(
  family: WritableDraft<Family>,
  peopleIndex: number,
  fieldName: string,
  value: string
) {
  const person = family.people[peopleIndex] as WritableDraft<Parent | Student>;

  switch (fieldName) {
    case "firstName":
    case "middleName":
    case "lastName":
    case "phone": {
      person[fieldName] = value;
      break;
    }
    case "isAddressUnique": {
      person.isAddressUnique = value === "on";
      break;
    }
    case "email":
    case "parentNotes": {
      if (!(person instanceof Parent)) {
        throw new Error(`Unexpected input name: ${fieldName}`);
      }
      person[fieldName] = value;
      break;
    }
    case "dateOfBirth":
    case "countryOfBirth":
    case "studentNotes": {
      if (!(person instanceof Student)) {
        throw new Error(`Unexpected input name: ${fieldName}`);
      }
      person[fieldName] = value;
      break;
    }
    default:
      throw new Error(`Unknown input name: ${fieldName}`);
  }
}

function updateAddress(
  family: WritableDraft<Family>,
  peopleIndex: number,
  newAddress: string,
) {
  family.people[peopleIndex].address = newAddress;
  if (!family.people[peopleIndex].isAddressUnique) {
    family.people.forEach((person) => {
      if (!person.isAddressUnique) {
        person.address = newAddress;
      }
    });
  }
}
