import FormGroup from "react-bootstrap/FormGroup";
import FormSelect from "react-bootstrap/FormSelect";
import FormLabel from "react-bootstrap/FormLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Family } from "../common/models/family";
import { FamilyRepository } from "../common/family_repository";

interface FamilyPickerProps {
  families: Family[];
  setFamilies: (families: Family[]) => void;
  selectedFamilyId: string | undefined;
  setSelectedFamilyId: (id: string) => void;
}

export default function FamilyPicker({families, setFamilies, selectedFamilyId, setSelectedFamilyId}: FamilyPickerProps) {
  const selectedFamily = families.find(family => family.uniqueId === selectedFamilyId);

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
    if (!window.confirm(`Are you sure you want to delete ${selectedFamily?.displayName}?`)) {
      return;
    }

    FamilyRepository.deleteFamily(selectedFamilyId).then(() => {
      const newFamilies = families.filter(family => family.uniqueId !== selectedFamilyId);
      setFamilies(newFamilies);
      setSelectedFamilyId(newFamilies[0]?.uniqueId);
    });
  }

  return (
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
  )
}
