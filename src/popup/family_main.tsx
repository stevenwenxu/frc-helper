import Container from "react-bootstrap/Container";
import FamilyPicker from "./family_picker";
import FamilyCard from "./family_card";

export default function FamilyMain() {
  return (
    <>
      <FamilyPicker />

      <Container className="g-0">
        <FamilyCard />
      </Container>
    </>
  )
}
