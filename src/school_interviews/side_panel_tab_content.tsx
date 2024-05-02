import Tab from "react-bootstrap/Tab";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Family } from "../common/models/family";
import { Parent, Person, Student } from "../common/models/person";

interface SidePanelTabContentProps {
  family: Family;
}

interface PersonFormProps {
  person: Person;
  personKey: string;
}

export default function SidePanelTabContent({family}: SidePanelTabContentProps) {
  let parentIndex = 1;
  let studentIndex = 1;

  const tabPanes = family.people.map((person) => {
    const eventKey = person instanceof Student ? `student_${studentIndex++}` : `parent_${parentIndex++}`;

    return (
      <Tab.Pane key={eventKey} eventKey={eventKey}>
        <PersonForm person={person} personKey={eventKey}/>
      </Tab.Pane>
    )
  });

  return (
    <Tab.Content>
      {tabPanes}
    </Tab.Content>
  )
}

function PersonForm({person, personKey}: PersonFormProps) {
  const inputStyle = {
    backgroundColor: "var(--bs-form-control-bg)",
    border: "var(--bs-border-width) solid var(--bs-border-color)"
  }
  const textAreaStyle = {
    maxWidth: "25em",
    height: "120px"
  }

  return (
    <Form>
      <FloatingLabel label="First name" controlId={`${personKey}_firstName`}>
        <Form.Control className="mb-2" type="text" placeholder="firstName" defaultValue={person.firstName} style={inputStyle}/>
      </FloatingLabel>

      <FloatingLabel label="Middle name" controlId={`${personKey}_middleName`}>
        <Form.Control className="mb-2" type="text" placeholder="middleName" defaultValue={person.middleName} style={inputStyle}/>
      </FloatingLabel>

      <FloatingLabel label="Last name" controlId={`${personKey}_lastName`}>
        <Form.Control className="mb-2" type="text" placeholder="lastName" defaultValue={person.lastName} style={inputStyle}/>
      </FloatingLabel>

      {person instanceof Parent && (
        <FloatingLabel label="Email" controlId={`${personKey}_email`}>
          <Form.Control className="mb-2" type="email" placeholder="email" defaultValue={person.email} style={inputStyle}/>
        </FloatingLabel>
      )}

      <FloatingLabel label="Phone" controlId={`${personKey}_phone`}>
        <Form.Control className="mb-2" type="tel" placeholder="phone" defaultValue={person.phone} style={inputStyle}/>
      </FloatingLabel>

      <FloatingLabel label="Address" controlId={`${personKey}_address`}>
        <Form.Control className="mb-2" type="text" placeholder="address" defaultValue={person.address} style={inputStyle}/>
      </FloatingLabel>

      {person instanceof Parent && (
        <FloatingLabel label="Parent notes" controlId={`${personKey}_parentNotes`}>
          <Form.Control className="mb-2" as="textarea" placeholder="parentNotes" style={textAreaStyle} defaultValue={person.parentNotes}/>
        </FloatingLabel>
      )}

      {person instanceof Student && (
        <>
          <FloatingLabel label="Date of birth" controlId={`${personKey}_dateOfBirth`}>
            <Form.Control className="mb-2" type="text" placeholder="dateOfBirth" defaultValue={person.dateOfBirth} style={inputStyle}/>
          </FloatingLabel>

          <FloatingLabel label="Country of birth" controlId={`${personKey}_countryOfBirth`}>
            <Form.Control className="mb-2" type="text" placeholder="countryOfBirth" defaultValue={person.countryOfBirth} style={inputStyle}/>
          </FloatingLabel>

          <FloatingLabel label="Student notes" controlId={`${personKey}_studentNotes`}>
            <Form.Control className="mb-2" as="textarea" placeholder="studentNotes" style={textAreaStyle} defaultValue={person.studentNotes}/>
          </FloatingLabel>
        </>
      )}
    </Form>
  )
}
