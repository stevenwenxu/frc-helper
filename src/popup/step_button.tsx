import Button from "react-bootstrap/Button";
import { Student } from '../common/models/person';
import { PDFDocument } from "pdf-lib";

interface StepButtonProps {
  student: Student;
}

export default function StepButton({student}: StepButtonProps) {
  return (
    <Button
      variant="outline-primary"
      className="flex-fill"
      onClick={() => { download(student) }}
    >
      <svg width="16" height="16" fill="currentColor" className="me-1">
        <use href="/images/download.svg#download-svg"/>
      </svg>
      STEP
    </Button>
  );
}

async function download(student: Student) {
  const doc = await PDFDocument.create();
  try {
    doc.addPage(await oral(student, doc));
    doc.addPage(await readingWriting(student, doc));
  } catch (error) {
    console.log(error);
    alert(error);
    return;
  }
  await generate(student, doc);
}

async function oral(student: Student, finalDoc: PDFDocument) {
  if (student.grade === "JK" || student.grade === "SK") {
    return Promise.reject("JK/SK not supported yet");
  } else if (student.grade === "") {
    return Promise.reject("Unknown grade. Fill from demographic page.");
  }

  const url = chrome.runtime.getURL("static/oral.pdf");
  const content = await (await fetch(url)).arrayBuffer();
  const pdfDoc = await PDFDocument.load(content);
  const page = pdfDoc.getPage(0);

  page.setFontSize(12);

  page.moveTo(320, 250);
  page.drawText(`Student Name: ${student.displayName}`);

  page.moveDown(20);
  page.drawText(`Local ID: ${student.localId}`);

  return (await finalDoc.copyPages(pdfDoc, [0]))[0];
}

async function readingWriting(student: Student, finalDoc: PDFDocument) {
  let url = "";
  switch (student.grade) {
    case "JK": case "SK":
      return Promise.reject("JK/SK not supported yet");
    case "1": case "2": case "3":
      url = chrome.runtime.getURL("static/reading-writing-1-3.pdf");
      break;
    case "4": case "5": case "6": case "7": case "8": case "9": case "10": case "11": case "12":
      url = chrome.runtime.getURL("static/reading-writing-4-12.pdf");
      break;
    default:
      return Promise.reject("Unknown grade. Fill from demographic page.");
  }

  const content = await (await fetch(url)).arrayBuffer();
  const pdfDoc = await PDFDocument.load(content);

  return (await finalDoc.copyPages(pdfDoc, [0]))[0];
}

async function generate(student: Student, pdfDocument: PDFDocument) {
  const pdfBytes = await pdfDocument.save();
  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
  const pdfUrl = URL.createObjectURL(pdfBlob);
  // chrome.tabs.create({ url: pdfUrl });

  const link = document.createElement("a");
  link.href = pdfUrl;
  link.setAttribute("download", `STEP_${student.firstName} ${student.lastName}.pdf`);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(pdfUrl);
}
