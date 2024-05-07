import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Family } from "../common/models/family";
import { FamilyRepository } from "../common/family_repository";
import EmptyAlert from "./empty_alert";
import FamilyCard from "./family_card";
import FamilyPicker from "./family_picker";

interface PopupProps {
  version: string;
}

export default function Popup({version}: PopupProps) {
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | undefined>(undefined);

  const selectedFamily = families.find(family => family.uniqueId === selectedFamilyId);

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

      <FamilyPicker
        families={families}
        setFamilies={setFamilies}
        selectedFamilyId={selectedFamilyId}
        setSelectedFamilyId={setSelectedFamilyId}
      />

      <Container className="g-0">
        {(families.length === 0 || !selectedFamily) ? (
          <EmptyAlert />
        ) : (
          <FamilyCard family={selectedFamily} />
        )}
      </Container>

      <footer>
        <p className="mt-3 text text-end text-black-50 fs-6">Version {version}</p>
      </footer>
    </Container>
  );
}
