import Button from "react-bootstrap/Button";
import { Parent, Student } from '../common/models/person';
import { Family } from "../common/models/family";
import { useMainContentType } from "./main_content_context";

interface GenerateEmailButtonProps {
  family: Family;
  peopleIndex: number;
}

export default function GenerateEmailButton({family, peopleIndex}: GenerateEmailButtonProps) {
  const student = family.people[peopleIndex] as Student;
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
