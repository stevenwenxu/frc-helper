import { Parent } from "../../common/models/person";
import { checkCheckbox, setValue } from "../../common/helpers/fill_helper";

export function fillParent(parent: Parent) {
  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;

  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnNameFirst)") as HTMLInputElement,
    parent.firstName,
    false
  );
  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnNameMiddle)") as HTMLInputElement,
    parent.middleName,
    false
  )
  setValue(
    elements.namedItem("relCtjCntOid.relCntPsnOid.psnNameLast") as HTMLInputElement,
    parent.lastName,
    false
  );
  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnEmail01)") as HTMLInputElement,
    parent.email,
    false
  );
  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnFieldA011)") as HTMLInputElement,
    "S",
    false
  );

  fillCheckboxes();
}

function fillCheckboxes() {
  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;

  const relationship = elements.namedItem("propertyValue(ctjRelateCode)") as HTMLInputElement;
  const livesWithStudent = elements.namedItem("prefixpropertyValue(ctjLivesWith)") as HTMLInputElement;
  const pickupAccess = elements.namedItem("prefixpropertyValue(ctjFieldA005)") as HTMLInputElement;
  const guardian = elements.namedItem("prefixpropertyValue(ctjFieldA002)") as HTMLInputElement;
  const legalCustody = elements.namedItem("prefixpropertyValue(ctjFieldA004)") as HTMLInputElement;
  const accessToRecords = elements.namedItem("prefixpropertyValue(ctjFieldA001)") as HTMLInputElement;
  const receiveMarkMailing = elements.namedItem("prefixpropertyValue(ctjMailGrade)") as HTMLInputElement;
  const receiveIncidentsMailing = elements.namedItem("prefixpropertyValue(ctjMailConduct)") as HTMLInputElement;
  const receiveOtherMailing = elements.namedItem("prefixpropertyValue(ctjMailOther)") as HTMLInputElement;
  const receiveEmail = elements.namedItem("prefixpropertyValue(ctjRecEmail)") as HTMLInputElement;

  const allCheckboxes = [livesWithStudent, pickupAccess, guardian, legalCustody, accessToRecords, receiveMarkMailing, receiveIncidentsMailing, receiveOtherMailing, receiveEmail];

  // Do not set anything if any of the checkboxes are already checked.
  if (allCheckboxes.some(checkbox => checkbox.checked)) {
    return;
  }

  // If the relationship is not set, setup hooks to set the checkboxes when it is.
  if (relationship.value === "") {
    relationship.addEventListener("change", () => fillCheckboxes());
    return;
  }

  if (relationship.value === "Mother" || relationship.value === "Father") {
    allCheckboxes.forEach(checkbox => checkCheckbox(checkbox, true));
  } else {
    checkCheckbox(pickupAccess, true);
  }
}
