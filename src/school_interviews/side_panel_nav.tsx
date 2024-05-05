import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Family } from '../common/models/family';
import { Parent, Student } from '../common/models/person';
import { FamilyRepository } from '../common/family_repository';

interface SidePanelNavProps {
  family: Family;
  didUpdateFamily: (updatedFamily: Family, newActivePersonKey: string) => void;
}

export default function SidePanelNav({family, didUpdateFamily}: SidePanelNavProps) {
  let parentIndex = 1;
  let studentIndex = 1;

  const navItems: JSX.Element[] = [];
  const dropdownItems: JSX.Element[] = [];

  family.people.forEach((person, peopleIndex) => {
    const individualIndex = person instanceof Student ? studentIndex++ : parentIndex++;
    const navItemKey = person instanceof Student ? `student_${individualIndex}` : `parent_${individualIndex}`;
    const dropdownItemKey = `new_from_${navItemKey}`;
    const displayName = person instanceof Student ? `Student ${individualIndex}` : `Parent ${individualIndex}`;

    navItems.push(
      <Nav.Item key={navItemKey}>
        <Nav.Link eventKey={navItemKey}>{displayName}</Nav.Link>
      </Nav.Item>
    );

    dropdownItems.push(
      <Dropdown.Item
        key={dropdownItemKey}
        eventKey={dropdownItemKey}
        onClick={() => { newPersonFrom(family, peopleIndex, didUpdateFamily) } }
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

function newPersonFrom(
  family: Family,
  peopleIndex: number,
  didUpdateFamily: (updatedFamily: Family, newActivePersonKey: string) => void
) {
  const person = family.people[peopleIndex];
  let newActivePersonKey = "";

  if (person instanceof Parent) {
    family.parents.push(person);
    newActivePersonKey = `parent_${family.parents.length}`;
  } else {
    family.students.push(person);
    newActivePersonKey = `student_${family.students.length}`;
  }

  FamilyRepository.saveFamily(family).then(() => {
    // pass back a copy of family, as we shouldn't mutate the original family object (state)
    didUpdateFamily(FamilyRepository.familyFromStoredFamily(family), newActivePersonKey);
  });
}
