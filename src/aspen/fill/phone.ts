import { Parent, Student } from "../../common/models/person";
import { setValue } from "../../common/helpers/fill_helper";

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
