import * as bootstrap from "bootstrap";
import { FamilyRepository } from "../../common/family_repository";
import { Student } from "../../common/models/person";
import { EmailBuilder } from "./email_builder";
import { renderFamilyDetails } from "../popup";

export function setupEmailButtons(familyId: string) {
  const emailButtons = document.querySelectorAll<HTMLButtonElement>(".tab-pane button[data-function='email'");
  for (const emailButton of Array.from(emailButtons)) {
    emailButton.addEventListener("click", async () => {
      const family = await FamilyRepository.getFamilyWithUniqueId(familyId);
      if (family) {
        const personIndex = parseInt(emailButton.dataset.personIndex!);
        const students = family.studentsInSameSchool(family.people[personIndex] as Student);

        renderEmail(students);
      } else {
        alert("This family has been deleted. Please reload the page.");
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
