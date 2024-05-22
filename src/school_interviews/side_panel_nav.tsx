import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Family } from '../common/models/family';
import { Parent, Student } from '../common/models/person';
import { FamilyRepository } from '../common/family_repository';
import { Updater } from 'use-immer';
import { produce } from 'immer';

interface SidePanelNavProps {
  family: Family;
  setFamily: Updater<Family | null>;
}

export default function SidePanelNav({family, setFamily}: SidePanelNavProps) {
  let parentIndex = 1;
  let studentIndex = 1;

  const navItems: JSX.Element[] = [];
  const dropdownItems: JSX.Element[] = [];

  const handleAddNewPerson = (peopleIndex: number) => {
    const newFamily = produce(family, (draft) => {
      const person = draft.people[peopleIndex];
      if (person instanceof Parent) {
        draft.parents.push(person);
      } else if (person instanceof Student) {
        draft.students.push(person);
      }
    });

    setFamily(newFamily);
    FamilyRepository.saveFamily(newFamily);
  };

  family.people.forEach((person, peopleIndex) => {
    const individualIndex = person instanceof Student ? studentIndex++ : parentIndex++;
    const navItemKey = person instanceof Student ? `student_${individualIndex}` : `parent_${individualIndex}`;
    const dropdownEventKey = person instanceof Student ?
      `student_${family.students.length + 1}` :
      `parent_${family.parents.length + 1}`;
    const displayName = person instanceof Student ? `Student ${individualIndex}` : `Parent ${individualIndex}`;

    navItems.push(
      <Nav.Item key={navItemKey}>
        <Nav.Link eventKey={navItemKey}>{displayName}</Nav.Link>
      </Nav.Item>
    );

    dropdownItems.push(
      <Dropdown.Item
        key={`new_from_${navItemKey}`}
        eventKey={dropdownEventKey}
        onClick={() => { handleAddNewPerson(peopleIndex) }}
      >
        {displayName}
      </Dropdown.Item>
    );
  });

  return (
    <Nav variant="tabs" className="mb-3">
      {navItems}

      <Dropdown as={Nav.Item}>
        <Dropdown.Toggle as={Nav.Link}>New from...</Dropdown.Toggle>
        <Dropdown.Menu className="m-0">
          {dropdownItems}
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
}
