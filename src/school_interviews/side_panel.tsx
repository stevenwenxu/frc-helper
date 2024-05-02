import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import SidePanelNav from './side_panel_nav';
import Tab from "react-bootstrap/Tab";
import { useFamily } from './helpers/use_family';
import SidePanelTabContent from './side_panel_tab_content';

interface SidePanelProps {
  familyId: string;
}

export default function SidePanel({familyId}: SidePanelProps) {
  const [show, setShow] = useState(false);
  const family = useFamily(familyId);

  return (
    <>
      <Button variant="primary" onClick={() => { setShow(true) }}>
        Add new family
      </Button>

      <Offcanvas show={show} placement="end" style={{width: "40%"}} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>New Family</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {family
            ? <Tab.Container id="family-container" defaultActiveKey="student_1">
                <SidePanelNav family={family}/>
                <SidePanelTabContent family={family}/>
              </Tab.Container>
            : "Loading..."}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
