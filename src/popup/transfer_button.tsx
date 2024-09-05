import Button from "react-bootstrap/Button";
import { Student } from "../common/models/person";
import { useFamilyContext } from "./family_context";

export default function TransferButton() {
  const { selectedFamilyId, selectedPeopleIndex, selectedPerson: student } = useFamilyContext();

  if (!selectedFamilyId || selectedPeopleIndex === undefined || !student || !(student instanceof Student)) {
    console.error("TransferButton: unexpected state", selectedFamilyId, selectedPeopleIndex, student);
    return null;
  }

  const onClick = async () => {
    const pathname = "/aspen/studentTransfer.do";
    const context = "student.enrollment.transfer.detailPopup";
    const runningSelection = student.originalOid.length === 0 ? "" : `&runningSelection=${student.originalOid}`;

    const newTab = await chrome.tabs.create({
      url: `https://ocdsb.myontarioedu.ca${pathname}?maximized=false&prefix=ENR&context=${context}${runningSelection}&deploymentId=ocdsbsis`
    });

    const myListener = async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (tabId == newTab.id && changeInfo.status == "complete") {
        const response = await chrome.tabs.sendMessage(tabId, {
          type: "fillAspen",
          familyId: selectedFamilyId,
          personIndex: selectedPeopleIndex,
          pathname: pathname,
          context: context
        });
        console.log("Filling transfer response", response);
        chrome.tabs.onUpdated.removeListener(myListener);
      }
    };

    chrome.tabs.onUpdated.addListener(myListener);
  }

  return (
    <Button
      variant="outline-primary"
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
