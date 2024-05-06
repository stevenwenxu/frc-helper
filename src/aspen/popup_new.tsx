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

  const familiesByVisitDate = families.reduce((acc, family) => {
    const visitDate = family.visitDate.toDateString();
    if (acc[visitDate]) {
      acc[visitDate].push(family);
    } else {
      acc[visitDate] = [family];
    }
    return acc;
  }, {} as { [visitDate: string]: Family[] });

  useEffect(() => {
    let ignore = false;
    FamilyRepository.getFamilies().then((families) => {
      if (!ignore) {
        families.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
        setFamilies(families);
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
            <FormSelect>
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
            <Button variant="outline-danger">
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
