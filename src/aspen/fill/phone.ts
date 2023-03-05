import { Parent, Student } from "../../common/models/person";
import { setValue } from "../fill";

export function fillPhone(person: Parent | Student) {
  const elements = document.forms.namedItem("multiplePersonAddressChildDetailForm")!.elements;

  setValue(
    elements.namedItem("propertyValue(padPhoneType)") as HTMLInputElement,
    "Cell"
  );

  setValue(
    elements.namedItem("propertyValue(padFieldB001)") as HTMLInputElement,
    person.phone
  );
}
