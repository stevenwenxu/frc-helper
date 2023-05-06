import * as bootstrap from "bootstrap";
import { FamilyRepository } from "../../common/family_repository";
import { Student } from "../../common/models/person";
import { EmailBuilder } from "./email_builder";
import { renderFamilyDetails } from "../popup";
import { PDFDocument, StandardFonts } from "pdf-lib";

export function setupEmailButtons(familyId: string) {
  const emailButtons = document.querySelectorAll<HTMLButtonElement>(".tab-pane button[data-function='email'");
  for (const emailButton of Array.from(emailButtons)) {
    emailButton.addEventListener("click", async () => {
      const family = await FamilyRepository.getFamilyWithUniqueId(familyId);
      if (family) {
        const personIndex = parseInt(emailButton.dataset.personIndex!);
        const students = family.studentsInSameSchool(family.people[personIndex] as Student);

        renderEmail(students);
        await test(students[0]);
      }
    });
  }
}

function renderEmail(students: Student[]) {
  const currentSelectedPersonId = document.querySelector(".nav-link.active")!.id;
  const familyDetails = document.getElementById("familyDetails")!;
  familyDetails.innerHTML = EmailBuilder.generateEmail(students);

  const closeBtn = document.querySelector<HTMLButtonElement>("button[data-function='close-email'");
  closeBtn?.addEventListener("click", async () => {
    await renderFamilyDetails();
    bootstrap.Tab.getOrCreateInstance(`#${currentSelectedPersonId}`).show();
  });

  const gmailBtn = document.querySelector<HTMLButtonElement>("button[data-function='gmail'");
  gmailBtn?.addEventListener("click", () => {
    const subject = encodeURIComponent(EmailBuilder.emailSubject(students));
    chrome.tabs.create({
      url: `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}`,
    });
  });
}

async function test(student: Student) {
  const url = chrome.runtime.getURL("static/oral.pdf");
  // chrome.tabs.create({ url: url });
  const content = await (await fetch(url)).arrayBuffer();
  const pdfDoc = await PDFDocument.load(content);
  const page = pdfDoc.getPage(0);

  page.setFont(await pdfDoc.embedFont(StandardFonts.Helvetica));
  page.setFontSize(10);

  page.moveTo(20, 280);
  page.drawText(`School: ${student.targetSchool}`);

  page.moveDown(20);
  page.drawText(`Student: ${student.displayName}`);

  page.moveDown(20);
  page.drawText(`Grade: ${student.gradeText}`);

  page.moveDown(20);
  page.drawText(`Local ID: ${student.localId}`);

  page.moveDown(20);
  page.drawText("FRC Assessor: Kate Cao");

  const modifiedPdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
  const pdfUrl = URL.createObjectURL(pdfBlob);
  // chrome.tabs.create({ url: pdfUrl });

  // the link is the actual button to download
  const dateStr = new Date().toLocaleDateString().replaceAll("/", "-");
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.setAttribute("download", `${student.displayName}_${dateStr}.pdf`);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(pdfUrl);
}
