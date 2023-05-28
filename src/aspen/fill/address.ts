import { Parent, Student } from "../../common/models/person";
import { AddressSanitizer } from "../helpers/address_sanitizer";
import { setValue } from "../../common/helpers/fill_helper";

export function fillAddress(person: Parent | Student) {
  const elements = document.forms.namedItem("multiplePersonAddressChildDetailForm")!.elements;

  // Fill postal code before address to trigger a more accurate address search
  setValue(
    elements.namedItem("propertyValue(relPadAdrOid_adrPostalCode)") as HTMLInputElement,
    AddressSanitizer.postalCode(person.address)
  );

  const sanitizedAddress = AddressSanitizer.sanitized(person.address);

  const addressElement = elements.namedItem("propertyValue(relPadAdrOid_adrFieldC010)") as HTMLInputElement;
  setValue(addressElement, AddressSanitizer.addressToFill(sanitizedAddress));
  addressElement.dispatchEvent(new Event("keyup"));

  setValue(
    elements.namedItem("propertyValue(relPadAdrOid_adrFieldB001)") as HTMLInputElement,
    AddressSanitizer.unitType(sanitizedAddress)
  );

  setValue(
    elements.namedItem("propertyValue(relPadAdrOid_adrFieldA001)") as HTMLInputElement,
    AddressSanitizer.unitNumber(sanitizedAddress)
  );
}
