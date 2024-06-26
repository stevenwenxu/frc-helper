import FormGroup from "react-bootstrap/FormGroup";
import FormSelect from "react-bootstrap/FormSelect";
import FormLabel from "react-bootstrap/FormLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Family } from "../common/models/family";
import { FamilyRepository } from "../common/family_repository";
import { useFamilyContext } from "./family_context";
import { useMainContentType } from "./main_content_context";
import { useModal } from "./modal_context";

export default function FamilyPicker() {
  const {
    families,
    setFamilies,
    selectedFamilyId,
    setSelectedFamilyId,
    selectedFamily,
    setSelectedPeopleIndex,
  } = useFamilyContext();
  const { setMainContentType } = useMainContentType();
  const { showModal, hideModal } = useModal();

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
    if (!selectedFamilyId || !selectedFamily) {
      return;
    }

    showModal({
      header: "Delete family",
      body: `Are you sure you want to delete ${selectedFamily.displayName}?`,
      primaryButtonText: "Delete",
      primaryButtonVariant: "danger",
      primaryButtonOnClick: () => {
        const newFamilies = families.filter(family => family.uniqueId !== selectedFamilyId);
        setFamilies(newFamilies);
        if (newFamilies.length > 0) {
          setSelectedFamilyId(newFamilies[0].uniqueId);
          setSelectedPeopleIndex(0);
        } else {
          setMainContentType("empty");
        }
        hideModal();
        FamilyRepository.deleteFamily(selectedFamilyId);
      },
      secondaryButtonText: "Cancel",
      secondaryButtonOnClick: () => {
        hideModal();
      },
    });
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFamilyId(event.target.value);
    setSelectedPeopleIndex(0);
  };

  return (
    <FormGroup controlId="familyPicker">
      <FormLabel className="mt-2">Select a family</FormLabel>
      <Row className="mb-2 gx-2">
        <Col>
          <FormSelect value={selectedFamilyId} onChange={onChange}>
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
