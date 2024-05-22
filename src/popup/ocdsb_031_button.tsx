import Button from "react-bootstrap/Button";
import { Parent, Student } from '../common/models/person';
import { StatusInCanada } from '../common/models/status_in_canada';
import { PDFDocument } from "pdf-lib";

interface OCDSB031ButtonProps {
  student: Student;
  firstParent: Parent;
}

export default function OCDSB031Button({student, firstParent}: OCDSB031ButtonProps) {
  return (
    <Button
      variant="outline-primary"
      className="flex-fill"
      onClick={() => { download(student, firstParent) }}
    >
      <svg width="16" height="16" fill="currentColor" className="me-1">
        <use href="/images/download.svg#download-svg"/>
      </svg>
      OCDSB 031
    </Button>
  );
}

async function download(student: Student, firstParent: Parent) {
  const url = chrome.runtime.getURL("static/OCDSB 031.pdf");
  const content = await (await fetch(url)).arrayBuffer();
  const pdfDoc = await PDFDocument.load(content);
  const form = pdfDoc.getForm();

  // console.log(form.getFields().map(field => field.getName()));

  form.getTextField("Legal Name").setText(student.legalFullName);
  form.getTextField("Date of Birth").setText(student.dateOfBirth);
  form.getTextField("Country of Birth").setText(student.countryOfBirth);
  form.getTextField("Date of First Entry to Canada").setText(student.dateOfEntryToCanada);
  form.getTextField("Previous Country of Residence").setText(student.countryOfLastResidence);

  switch (student.statusInCanada) {
    case StatusInCanada.PermanentResident:
      form.getCheckBox("Check Box1").check();
      form.getTextField("Confirmation of Permanent Residence  PR Card").setText(student.dateOfEntryToCanada);
      break;
    case StatusInCanada.ParentWorkPermit:
      form.getCheckBox("Check Box2").check();
      break;
    case StatusInCanada.Diplomat:
      form.getCheckBox("Check Box3").check();
      break;
    case StatusInCanada.Refugee:
      form.getCheckBox("Check Box4").check();
      break;
    case StatusInCanada.ParentStudyPermit:
      form.getCheckBox("Check Box5").check();
      break;
    case StatusInCanada.CanadianCitizen:
      form.getCheckBox("Check Box6").check();
      break;
    default:
      form.getCheckBox("Check Box7").check();
      form.getTextField("Other").setText(student.statusInCanada);
      break;
  }

  const today = new Date().toLocaleDateString();
  form.getTextField("Date").setText(today);
  form.getTextField("Date_2").setText(today);

  form.getTextField("Name Please Print_2").setText(firstParent.fullName);

  const page = pdfDoc.getPage(0);
  page.setFontSize(12);
  page.moveTo(430, 730);
  page.drawText(`${student.targetSchool}-${isNaN(parseInt(student.grade)) ? "" : "G"}${student.grade}`);
  page.moveDown(20);
  page.drawText(`Local ID: ${student.localId}`);

  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
  const pdfUrl = URL.createObjectURL(pdfBlob);
  chrome.tabs.create({ url: pdfUrl });

  URL.revokeObjectURL(pdfUrl);
}
