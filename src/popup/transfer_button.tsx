import Button from "react-bootstrap/Button";
import { Student } from "../common/models/person";
import { useFamilyContext } from "./family_context";
import { useModal } from "./modal_context";

export default function TransferButton() {
  const { selectedPerson: student } = useFamilyContext();
  const { showModal, hideModal } = useModal();

  if (!student || !(student instanceof Student)) {
    console.error("TransferButton: unexpected state", student);
    return null;
  }

  const onClick = () => {
    if (student.originalOid.length === 0) {
      showModal({
        header: "Fill student again",
        body: "Please fill the student information again.",
        primaryButtonText: "OK",
        primaryButtonOnClick: () => {
          hideModal();
        }
      })
    } else {
      chrome.tabs.create({
        url: `https://ocdsb.myontarioedu.ca/aspen/studentTransfer.do?maximized=false&prefix=ENR&context=student.enrollment.transfer.detailPopup&runningSelection=${student.originalOid}&deploymentId=ocdsbsis`
      })
    }
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
