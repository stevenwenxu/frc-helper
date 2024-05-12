import Button from "react-bootstrap/Button";
import { useMainContentType } from "./main_content_context";

export default function GenerateEmailButton() {
  const { setMainContentType } = useMainContentType();

  return (
    <Button
      variant="outline-primary"
      className="flex-fill"
      onClick={() => { setMainContentType("email") }}
    >
      Generate email
    </Button>
  );
}
