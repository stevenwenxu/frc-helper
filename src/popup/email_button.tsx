import Button from "react-bootstrap/Button";
import { useMainContentType } from './main_content_context';
import { Student } from "../common/models/person";
import { useFamilyContext } from "./family_context";

export default function EmailButton() {
  const { setMainContentType } = useMainContentType();
  const { selectedFamily: family, selectedPerson: student } = useFamilyContext();

  if (!family || !student || !(student instanceof Student)) {
    console.error("EmailButton: unexpected state", family, student);
    return null;
  }

  const onClick = () => {
    setMainContentType("email");
  }

  return (
    <Button
      variant="outline-primary"
      className="flex-fill"
      onClick={onClick}
    >
      <svg width="16" height="16" fill="currentColor" className="me-1">
        <use href="/images/email.svg#email-svg"/>
      </svg>
      Email
    </Button>
  )
}
