import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Family } from '../common/models/family';
import { Student } from '../common/models/person';

interface SidePanelNavProps {
  family: Family;
}

export default function SidePanelNav({family}: SidePanelNavProps) {
  let parentIndex = 1;
  let studentIndex = 1;

  let navItems: JSX.Element[] = [];
  let dropdownItems: JSX.Element[] = [];

  family.people.forEach((person) => {
    const personIndex = person instanceof Student ? studentIndex++ : parentIndex++;
    const navItemKey = person instanceof Student ? `student_${personIndex}` : `parent_${personIndex}`;
    const dropdownItemKey = `new_from_${navItemKey}`;
    const displayName = person instanceof Student ? `Student ${personIndex}` : `Parent ${personIndex}`;

    navItems.push(
      <Nav.Item key={navItemKey}>
        <Nav.Link eventKey={navItemKey}>{displayName}</Nav.Link>
      </Nav.Item>
    );

    dropdownItems.push(
      <Dropdown.Item key={dropdownItemKey} eventKey={dropdownItemKey}>{displayName}</Dropdown.Item>
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
