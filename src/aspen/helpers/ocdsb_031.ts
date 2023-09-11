import { FamilyRepository } from "../../common/family_repository";
import { Parent, Student } from "../../common/models/person";

type PDFDocumentType = typeof import("pdf-lib").PDFDocument;
type PDFDocument = import("pdf-lib").PDFDocument;
let _PDFDocument: PDFDocumentType | null = null;

export function setup031Buttons(familyId: string) {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".tab-pane button[data-function='download031'");
  for (const button of Array.from(buttons)) {
    button.addEventListener("click", async () => {
      const family = await FamilyRepository.getFamilyWithUniqueId(familyId);
      if (family) {
        const personIndex = parseInt(button.dataset.personIndex!);

        await download(family.people[personIndex] as Student, family.parents[0]);
      } else {
        alert("This family has been deleted. Please reload the page.");
      }
    });
  }
}

async function download(student: Student, parent: Parent) {
  const url = chrome.runtime.getURL("static/OCDSB 031.pdf");
  const content = await (await fetch(url)).arrayBuffer();
  const PDFDocument = await loadPDFLib();
  const pdfDoc = await PDFDocument.load(content);
  const form = pdfDoc.getForm();

  form.getTextField("Legal Name").setText(student.legalFullName);
  form.getTextField("Date of Birth").setText(student.dateOfBirth);
  form.getTextField("Country of Birth").setText(student.countryOfBirth);

  const today = new Date().toLocaleDateString();
  form.getTextField("Date").setText(today);
  form.getTextField("Date_2").setText(today);

  form.getTextField("Name Please Print_2").setText(parent.fullName);

  await generate(student, pdfDoc);
}

async function generate(student: Student, pdfDocument: PDFDocument) {
  const pdfBytes = await pdfDocument.save();
  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
  const pdfUrl = URL.createObjectURL(pdfBlob);
  chrome.tabs.create({ url: pdfUrl });

  // const link = document.createElement("a");
  // link.href = pdfUrl;
  // link.setAttribute("download", `OCDSB 031_${student.firstName} ${student.lastName}.pdf`);
  // link.style.display = "none";
  // document.body.appendChild(link);
  // link.click();

  URL.revokeObjectURL(pdfUrl);
}

async function loadPDFLib() {
  _PDFDocument = _PDFDocument ?? (await import("pdf-lib")).PDFDocument;
  return _PDFDocument;
}
