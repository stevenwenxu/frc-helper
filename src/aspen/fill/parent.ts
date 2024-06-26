import { Parent } from "../../common/models/person";
import { checkCheckbox, setValue } from "../../common/helpers/fill_helper";

export function fillParent(parent: Parent) {
  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;
  const email = elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnEmail01)") as HTMLInputElement;

  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnNameFirst)") as HTMLInputElement,
    parent.firstName,
    false
  );
  setValue(
    elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnNameMiddle)") as HTMLInputElement,
    parent.middleName,
    false
  );
  setValue(
    elements.namedItem("relCtjCntOid.relCntPsnOid.psnNameLast") as HTMLInputElement,
    parent.lastName,
    false
  );
  setValue(
    email,
    parent.email,
    false
  );
  if (email.value !== "") {
    setValue(
      elements.namedItem("propertyValue(relCtjCntOid_relCntPsnOid_psnFieldA011)") as HTMLInputElement,
      "S",
      false
    );
  }

  fillCheckboxes();
}

function fillCheckboxes() {
  const elements = document.forms.namedItem("personAddressDetailForm")!.elements;

  const relationship = elements.namedItem("propertyValue(ctjRelateCode)") as HTMLInputElement;
  const hasPortalAccess = elements.namedItem("prefixpropertyValue(ctjPortalAcs)") as HTMLInputElement;
  const livesWithStudent = elements.namedItem("prefixpropertyValue(ctjLivesWith)") as HTMLInputElement;
  const pickupAccess = elements.namedItem("prefixpropertyValue(ctjFieldA005)") as HTMLInputElement;
  const guardian = elements.namedItem("prefixpropertyValue(ctjFieldA002)") as HTMLInputElement;
  const legalCustody = elements.namedItem("prefixpropertyValue(ctjFieldA004)") as HTMLInputElement;
  const accessToRecords = elements.namedItem("prefixpropertyValue(ctjFieldA001)") as HTMLInputElement;
  const receiveMarkMailing = elements.namedItem("prefixpropertyValue(ctjMailGrade)") as HTMLInputElement;
  const receiveIncidentsMailing = elements.namedItem("prefixpropertyValue(ctjMailConduct)") as HTMLInputElement;
  const receiveOtherMailing = elements.namedItem("prefixpropertyValue(ctjMailOther)") as HTMLInputElement;
  const receiveEmail = elements.namedItem("prefixpropertyValue(ctjRecEmail)") as HTMLInputElement;

  const allCheckboxes = [hasPortalAccess, livesWithStudent, pickupAccess, guardian, legalCustody, accessToRecords, receiveMarkMailing, receiveIncidentsMailing, receiveOtherMailing, receiveEmail];

  const check = () => {
    if (relationship.value === "Mother" || relationship.value === "Father") {
      allCheckboxes.forEach(checkbox => checkCheckbox(checkbox, true));
    } else {
      allCheckboxes.forEach(checkbox => checkCheckbox(checkbox, false));
      if (relationship.value !== "") {
        checkCheckbox(pickupAccess, true);
      }
    }
  }

  check();
  relationship.addEventListener("change", check);
}
