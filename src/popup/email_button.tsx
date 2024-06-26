import Button from "react-bootstrap/Button";
import { useMainContentType } from './main_content_context';
import { Student } from "../common/models/person";
import { useFamilyContext } from "./family_context";
import { useModal } from "./modal_context";

export default function EmailButton() {
  const { setMainContentType } = useMainContentType();
  const { selectedFamily: family, selectedPerson: student } = useFamilyContext();
  const { showModal, hideModal } = useModal();

  if (!family || !student || !(student instanceof Student)) {
    console.error("EmailButton: unexpected state", family, student);
    return null;
  }

  const onClick = () => {
    if (student.isNewRegistration) {
      const pendingTransferNotChecked = family.studentsInSameSchool(student)
        .filter(s => !s.pendingTransferChecked)
        .map(s => s.firstName);

      if (pendingTransferNotChecked.length > 0) {
        showModal({
          header: "Transfer pending not checked",
          body: `Re: ${pendingTransferNotChecked.join(", ")}\n\nDon't forget to check the "Transfer pending" checkbox before sending email to the school.\n\nIf it's already checked, click Fill again to ensure the latest data is used.`,
          primaryButtonText: "Continue",
          primaryButtonVariant: "warning",
          primaryButtonOnClick: () => {
            hideModal();
            setMainContentType("email");
          },
        });
      } else {
        setMainContentType("email");
      }
    } else {
      setMainContentType("email");
    }
  }

  return (
    <Button
      variant="outline-secondary"
      className="flex-fill"
      onClick={onClick}
    >
      Preview email
    </Button>
  )
}
