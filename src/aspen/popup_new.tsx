import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import FormGroup from "react-bootstrap/FormGroup";
import FormSelect from "react-bootstrap/FormSelect";
import FormLabel from "react-bootstrap/FormLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Family } from "../common/models/family";
import { FamilyRepository } from "../common/family_repository";

interface PopupProps {
  version: string;
}

export default function Popup({version}: PopupProps) {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | undefined>(undefined);

  const familiesByVisitDate = families.reduce((acc, family) => {
    const visitDate = family.visitDate.toDateString();
    if (acc[visitDate]) {
      acc[visitDate].push(family);
    } else {
      acc[visitDate] = [family];
    }
    return acc;
  }, {} as { [visitDate: string]: Family[] });

  const deleteFamily = () => {
    if (!selectedFamilyId) {
      return;
    }

    const familyName = families.find(family => family.uniqueId === selectedFamilyId)?.displayName;
    if (!window.confirm(`Are you sure you want to delete ${familyName}?`)) {
      return;
    }
    FamilyRepository.deleteFamily(selectedFamilyId).then(() => {
      const newFamilies = families.filter(family => family.uniqueId !== selectedFamilyId);
      setFamilies(newFamilies);
      setSelectedFamilyId(newFamilies[0]?.uniqueId);
    });
  }

  useEffect(() => {
    let ignore = false;
    FamilyRepository.getFamilies().then((families) => {
      if (!ignore) {
        families.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
        setFamilies(families);
        setSelectedFamilyId(families[0]?.uniqueId);
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <Container>
      <h1 className="mt-4">Family Reception Centre</h1>

      <FormGroup controlId="familyPicker">
        <FormLabel className="mt-2">Select a family</FormLabel>
        <Row className="mb-2 gx-2">
          <Col>
            <FormSelect value={selectedFamilyId} onChange={(e) => { setSelectedFamilyId(e.target.value) }}>
              {Object.keys(familiesByVisitDate).map((visitDate) => (
                <optgroup label={visitDate} key={visitDate}>
                  {familiesByVisitDate[visitDate].map((family) => (
                    <option value={family.uniqueId} key={family.uniqueId}>{family.displayName}</option>
                  ))}
                </optgroup>
              ))}
            </FormSelect>
          </Col>
          <Col className="col-auto">
            <Button variant="outline-danger" onClick={deleteFamily}>
              <svg width="16" height="16" fill="currentColor">
                <use href="/images/trash.svg#trash-svg"/>
              </svg>
            </Button>
          </Col>
        </Row>
      </FormGroup>

      <footer>
        <p className="mt-3 text text-end text-black-50 fs-6">Version {version}</p>
      </footer>
    </Container>
  );
}
