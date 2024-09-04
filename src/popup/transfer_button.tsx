import Button from "react-bootstrap/Button";
import { Student } from "../common/models/person";
import { useFamilyContext } from "./family_context";
import { useModal } from "./modal_context";

export default function TransferButton() {
  const { selectedFamilyId, selectedPeopleIndex, selectedPerson: student } = useFamilyContext();
  const { showModal, hideModal } = useModal();

  if (!selectedFamilyId || selectedPeopleIndex === undefined || !student || !(student instanceof Student)) {
    console.error("TransferButton: unexpected state", selectedFamilyId, selectedPeopleIndex, student);
    return null;
  }

  const onClick = async () => {
    if (student.originalOid.length === 0) {
      showModal({
        header: "Missing student information",
        body: "Please fill the student information from Aspen.",
        primaryButtonText: "OK",
        primaryButtonOnClick: () => {
          hideModal();
        }
      });
      return;
    }

    const pathname = "/aspen/studentTransfer.do";
    const context = "student.enrollment.transfer.detailPopup";

    const newTab = await chrome.tabs.create({
      url: `https://ocdsb.myontarioedu.ca${pathname}?maximized=false&prefix=ENR&context=${context}&runningSelection=${student.originalOid}&deploymentId=ocdsbsis`
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (tabId == newTab.id! && changeInfo.status == "complete") {
        const response = await chrome.tabs.sendMessage(tabId, {
          type: "fillAspen",
          familyId: selectedFamilyId,
          personIndex: selectedPeopleIndex,
          pathname: pathname,
          context: context
        });

        console.log("Filling transfer response", response);
      }
    });
  }

  return (
    <Button
      variant="outline-secondary"
      className="flex-fill"
      onClick={onClick}
    >
      <svg width="16" height="16" fill="currentColor" className="me-1">
        <use href="/images/transfer.svg#transfer-svg"/>
      </svg>
      Transfer
    </Button>
  )
}
