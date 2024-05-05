import Tab from "react-bootstrap/Tab";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Family } from "../common/models/family";
import { Parent, Student } from "../common/models/person";
import { FamilyRepository } from "../common/family_repository";

interface SidePanelTabContentProps {
  family: Family;
  didUpdateFamily: (updatedFamily: Family) => void;
}

interface PersonFormProps {
  family: Family;
  peopleIndex: number;
  personKey: string;
  didUpdateAddress: () => void;
}

export default function SidePanelTabContent({family, didUpdateFamily}: SidePanelTabContentProps) {
  let parentIndex = 1;
  let studentIndex = 1;

  const didUpdateAddress = () => {
    // pass back a copy of family, as we shouldn't mutate the original family object (state)
    didUpdateFamily(FamilyRepository.familyFromStoredFamily(family));
  }

  return (
    <Tab.Content>
      {family.people.map((person, peopleIndex) => {
        const eventKey = person instanceof Student ? `student_${studentIndex++}` : `parent_${parentIndex++}`;

        return (
          <Tab.Pane key={eventKey} eventKey={eventKey}>
            <PersonForm
              family={family}
              peopleIndex={peopleIndex}
              personKey={eventKey}
              didUpdateAddress={didUpdateAddress}
            />
          </Tab.Pane>
        )
      })}
    </Tab.Content>
  )
}

function PersonForm({family, peopleIndex, personKey, didUpdateAddress}: PersonFormProps) {
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
          defaultValue={person.firstName}
          onBlur={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.value) }}
          style={inputStyle}
        />
      </FloatingLabel>

      <FloatingLabel label="Middle name" controlId={`${personKey}_middleName`}>
        <Form.Control
          className="mb-2"
          type="text"
          placeholder="middleName"
          name="middleName"
          defaultValue={person.middleName}
          onBlur={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.value) }}
          style={inputStyle}
        />
      </FloatingLabel>

      <FloatingLabel label="Last name" controlId={`${personKey}_lastName`}>
        <Form.Control
          className="mb-2"
          type="text"
          placeholder="lastName"
          name="lastName"
          defaultValue={person.lastName}
          onBlur={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.value) }}
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
            defaultValue={person.email}
            onBlur={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.value) }}
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
          defaultValue={person.phone}
          onBlur={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.value) }}
          style={inputStyle}
        />
      </FloatingLabel>

      <Row className="mb-2 align-items-center">
        <Col md="auto" style={{paddingRight: 0}}>
          <Form.Check id={`${personKey}_unique`} type="checkbox">
            <Form.Check.Input
              type="checkbox"
              style={checkboxStyle}
              name="isAddressUnique"
              defaultChecked={person.isAddressUnique}
              onChange={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.checked ? "on" : "off") }}
            />
            <Form.Check.Label>Unique</Form.Check.Label>
          </Form.Check>
        </Col>
        <Col>
          <FloatingLabel label="Address" controlId={`${personKey}_address`}>
            <Form.Control
              type="text"
              placeholder="address"
              name="address"
              value={person.address}
              onChange={(e) => { updateAddress(family, peopleIndex, e.target.value, didUpdateAddress) } }
              onBlur={(e) => { FamilyRepository.saveFamily(family) }}
              style={inputStyle}
            />
          </FloatingLabel>
        </Col>
      </Row>

      {person instanceof Parent && (
        <FloatingLabel label="Parent notes" controlId={`${personKey}_parentNotes`}>
          <Form.Control
            className="mb-2"
            as="textarea"
            placeholder="parentNotes"
            name="parentNotes"
            defaultValue={person.parentNotes}
            onBlur={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.value) }}
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
              defaultValue={person.dateOfBirth}
              onBlur={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.value) }}
              style={inputStyle}
            />
          </FloatingLabel>

          <FloatingLabel label="Country of birth" controlId={`${personKey}_countryOfBirth`}>
            <Form.Control
              className="mb-2"
              type="text"
              placeholder="countryOfBirth"
              name="countryOfBirth"
              defaultValue={person.countryOfBirth}
              onBlur={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.value) }}
              style={inputStyle}
            />
          </FloatingLabel>

          <FloatingLabel label="Student notes" controlId={`${personKey}_studentNotes`}>
            <Form.Control
              className="mb-2"
              as="textarea"
              placeholder="studentNotes"
              name="studentNotes"
              defaultValue={person.studentNotes}
              onBlur={(e) => { updatePerson(family, peopleIndex, e.target.name, e.target.value) }}
              style={textAreaStyle}
            />
          </FloatingLabel>
        </>
      )}
    </Form>
  )
}

function updatePerson(
  family: Family,
  peopleIndex: number,
  fieldName: string,
  value: string
) {
  const person = family.people[peopleIndex];

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

  FamilyRepository.saveFamily(family);
}

function updateAddress(
  family: Family,
  peopleIndex: number,
  newAddress: string,
  didUpdateAddress: () => void
) {
  family.people[peopleIndex].address = newAddress;
  if (!family.people[peopleIndex].isAddressUnique) {
    family.people.forEach((person) => {
      if (!person.isAddressUnique) {
        person.address = newAddress;
      }
    });
  }
  didUpdateAddress();
}
