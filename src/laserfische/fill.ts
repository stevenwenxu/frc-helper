import { FamilyRepository } from "../common/family_repository";
import { fillImportDocument } from "./fill_import_document";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Laserfische content script got message", request);
    if (Object.hasOwn(request, "familyId") && Object.hasOwn(request, "studentIndex")) {
      fill(request.familyId, request.studentIndex).then((fillResponse) => {
        sendResponse({ type: "fillResponse", message: fillResponse });
      });
    } else {
      sendResponse({ message: `Laserfische content script didn't understand request: ${request}` });
    }

    // https://stackoverflow.com/a/56483156
    return true;
  }
);

async function fill(familyId: string, studentIndex: number) {
  // Need another selector before #fieldPaneDisplay because there are two divs with the same id...
  const importDocumentModal = document.querySelector("div.modal-dialog #fieldPaneDisplay > form > div.templateFields > div:nth-child(3) > div");
  if (!importDocumentModal) {
    return "unknownFillDestination";
  }

  const family = await FamilyRepository.getFamilyWithUniqueId(familyId);
  if (!family) {
    return "familyNotFound";
  }

  const student = family.students[studentIndex];

  fillImportDocument(student);

  return "ok";
}
