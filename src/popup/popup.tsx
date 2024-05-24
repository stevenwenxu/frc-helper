import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Spinner from 'react-bootstrap/Spinner';
import { FamilyRepository } from "../common/family_repository";
import EmptyAlert from "./empty_alert";
import { useMainContentType } from "./main_content_context";
import FamilyMain from "./family_main";
import { useFamilyContext } from "./family_context";
import Email from "./email";
import MathAssessment from "./math_assessment";

interface PopupProps {
  version: string;
}

export default function Popup({version}: PopupProps) {
  const { setFamilies, setSelectedFamilyId, setSelectedPeopleIndex } = useFamilyContext();
  const { mainContentType, setMainContentType } = useMainContentType();

  useEffect(() => {
    let ignore = false;
    FamilyRepository.getFamilies().then((fetchedFamilies) => {
      if (!ignore) {
        fetchedFamilies.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
        setFamilies(fetchedFamilies);
        if (fetchedFamilies.length > 0) {
          setSelectedFamilyId(fetchedFamilies[0].uniqueId);
          setSelectedPeopleIndex(0);
          setMainContentType("family")
        } else {
          setMainContentType("empty");
        }
      }
    });
    return () => {
      ignore = true;
    }
  }, [setFamilies, setSelectedFamilyId, setSelectedPeopleIndex, setMainContentType]);

  useEffect(() => {
    const handleMessage = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      switch (message.type) {
        case "fillResponse": {
          switch (message.message) {
            case "ok": {
              console.log("Fill was successful");
              break;
            }
            case "refreshRequired": {
              FamilyRepository.getFamilies().then((fetchedFamilies) => {
                fetchedFamilies.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());
                setFamilies(fetchedFamilies);
              });
              console.log("Refreshed families");
              break;
            }
            case "familyNotFound": {
              alert("This family has been deleted. Please reload the page.");
              break;
            }
            case "unknownPage": {
              alert("Something went wrong. Are you filling the correct page?");
              break;
            }
            default: {
              console.error("FamilyMain: unknown fillResponse", message.message);
              break;
            }
          }
          break;
        }
        case "confirmUpdateStudentName": {
          const response = window.confirm(`Do you want to update ${message.oldName} to ${message.newName}?`);
          sendResponse({ confirmUpdateStudentName: response });
          break;
        }
        default: {
          console.error("FamilyMain: unknown message", message, sender.url);
          break;
        }
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [setFamilies]);

  let mainContent: JSX.Element;
  switch (mainContentType) {
    case "loading":
      mainContent = <Spinner animation="border" variant="primary" />
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
    case "mathAssessment":
      mainContent = <MathAssessment />
      break;
  }

  return (
    <Container>
      <h1 className="my-4">Family Reception Centre</h1>

      {mainContent}

      <footer>
        <p className="mt-3 text text-end text-black-50 fs-6">Version {version}</p>
      </footer>
    </Container>
  );
}
