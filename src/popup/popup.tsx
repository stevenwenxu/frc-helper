import { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { FamilyRepository } from "../common/family_repository";
import EmptyAlert from "./empty_alert";
import { MainContentContext } from "./main_content_context";
import FamilyMain from "./family_main";
import { FamilyContext } from "./family_context";
import Email from "./email";

interface PopupProps {
  version: string;
}

export default function Popup({version}: PopupProps) {
  const { families, setFamilies, setSelectedFamilyId, setSelectedPeopleIndex } = useContext(FamilyContext);
  const { mainContentType, setMainContentType } = useContext(MainContentContext);

  useEffect(() => {
    let ignore = false;
    FamilyRepository.getFamilies().then((fetchedFamilies) => {
      if (!ignore) {
        fetchedFamilies.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
        setFamilies(fetchedFamilies);
        setSelectedFamilyId(fetchedFamilies[0]?.uniqueId);
        setSelectedPeopleIndex(0);
      }
    });
    return () => {
      ignore = true;
    }
  }, [setFamilies, setSelectedFamilyId, setSelectedPeopleIndex]);

  useEffect(() => {
    if (families.length === 0) {
      setMainContentType("empty");
    } else {
      setMainContentType("family");
    }
  }, [families.length, setMainContentType])

  let mainContent: JSX.Element;
  switch (mainContentType) {
    case "loading":
      mainContent = <span>Loading...</span>
      break;
    case "empty":
      mainContent = <EmptyAlert />;
      break;
    case "family":
      mainContent = <FamilyMain />;
      break;
    case "email":
      mainContent = <Email />
      break;
  }

  return (
    <Container>
      <h1 className="mt-4">Family Reception Centre</h1>

      {mainContent}

      <footer>
        <p className="mt-3 text text-end text-black-50 fs-6">Version {version}</p>
      </footer>
    </Container>
  );
}
