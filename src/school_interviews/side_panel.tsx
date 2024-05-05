import { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Tab from "react-bootstrap/Tab";
import SidePanelNav from './side_panel_nav';
import SidePanelTabContent from './side_panel_tab_content';
import { Family } from "../common/models/family";
import { FamilyRepository } from "../common/family_repository";

interface SidePanelProps {
  familyId: string;
  parseNewFamily: () => Family;
}

export default function SidePanel({familyId, parseNewFamily}: SidePanelProps) {
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [family, setFamily] = useState<Family | null>(null);
  const [activePersonkey, setActivePersonKey] = useState("student_1");

  useEffect(() => {
    let ignore = false;
    FamilyRepository.getFamilyWithUniqueId(familyId).then((family) => {
      if (!ignore) {
        setFamily(family);
        setIsLoading(false);
      }
    });
    return () => {
      ignore = true;
    }
  }, [familyId]);

  const onButtonClick = () => {
    if (family) {
      setShowSidePanel(true);
    } else {
      const newFamily = parseNewFamily();
      FamilyRepository.saveFamily(newFamily).then(() => {
        setFamily(newFamily);
        setShowSidePanel(true);
      });
    }
  }

  const didUpdateFamily = (updatedFamily: Family, newActivePersonKey?: string) => {
    setFamily(updatedFamily);
    if (newActivePersonKey) {
      setActivePersonKey(newActivePersonKey);
    }
  }

  const onSelectTab = (eventKey: string | null) => {
    setActivePersonKey(eventKey ?? "student_1");
  }

  return (
    <>
      <Button variant="primary" onClick={onButtonClick} disabled={isLoading}>
        { isLoading ? "Loading..." : (family ? "View Family" : "Add New Family") }
      </Button>

      <Offcanvas show={showSidePanel} placement="end" style={{width: "40%"}} onHide={() => setShowSidePanel(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>New Family</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {
            family
              ? <Tab.Container id="family-container" activeKey={activePersonkey} onSelect={onSelectTab}>
                  <SidePanelNav family={family} didUpdateFamily={didUpdateFamily} />
                  <SidePanelTabContent family={family} didUpdateFamily={didUpdateFamily} />
                </Tab.Container>
              : "Oops, something is wrong... Please refresh the page."
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
