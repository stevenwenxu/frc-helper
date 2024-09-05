import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import { useMainContentType } from './main_content_context';
import { useFamilyContext } from './family_context';
import { Student } from '../common/models/person';
import { SchoolCategory } from '../common/models/school_category';
import { LanguageCategory } from '../common/models/language_category';

export default function Email() {
  const { setMainContentType } = useMainContentType();
  const { selectedFamily: family, selectedPerson: student } = useFamilyContext();

  if (!family || !student || !(student instanceof Student)) {
    console.error("Email: unexpected state", family, student);
    return null;
  }

  const students = family.studentsInSameSchool(student);

  return (
    <>
      <Stack direction="horizontal" gap={3}>
        <CloseButton onClick={() => { setMainContentType("family") }} />
        <Button variant="outline-primary" onClick={() => { openGmail(students) }}>
          <svg width="16" height="16" fill="currentColor" className="me-1">
            <use href="/images/email.svg#email-svg"/>
          </svg>
          Open Gmail
        </Button>
      </Stack>

      <iframe
        title="email body"
        style={{width: "100%", height: "600px", border: "none"}}
        srcDoc={emailBody(students)}
      >
      </iframe>
    </>
  )
}

function openGmail(students: Student[]) {
  const subject = encodeURIComponent(emailSubject(students));
  chrome.tabs.create({
    url: `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}`,
  });
}

function emailSubject(students: Student[]) {
  const formatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
  const initials = formatter.format(students.map(s => s.initials));
  const student = students[0];
  if (student.isPreRegistration) {
    return `FRC New Pre-registration ${initials} ${student.targetSchool}`;
  } else if (student.isNewRegistration) {
    return `FRC New Registration ${initials} ${student.targetSchool}`;
  } else {
    return `FRC Student Assessment in Aspen ${initials} ${student.targetSchool}`;
  }
}

function emailBody(students: Student[]) {
  const formatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
  const lastNames = formatter.format([...new Set(students.map(s => s.lastName))]);
  const student = students[0];
  const moreThanOneStudent = students.length > 1;

  return `
    <html>
      <head>
        <style>
          body {
            user-select: all;
          }
          p, li, td {
            font-size: 13px;
            font-family: sans-serif;
          }
          table {
            border: none;
            border-collapse: collapse;
            width: fit-content;
          }
          td {
            border: 1px solid;
            padding: 6px;
          }
          td:first-child {
            width: 30%;
          }
          .bold {
            font-weight: bold;
          }
          .error {
            color: red;
          }
        </style>
      </head>
      <body>
        <p>Dear ${emptyGuard(student.targetSchool)} Team,</p>

        <p>We had the pleasure of meeting the ${emptyGuard(lastNames)} family recently at the Family Reception Centre.
        ${ student.isPreRegistration ? `
        Based on the home address provided during the intake meeting, their ${moreThanOneStudent ? "children have" : "child has"} been pre-registered in Aspen to your school. You will find them in Aspen in your "All Pre-reg Students" list.
        ` : student.isNewRegistration ? `
        Based on the home address provided during the intake meeting, their ${moreThanOneStudent ? "children have" : "child has"} been activated in Aspen and can be found in your "All Active Student" list.
        ` : `
        ${ moreThanOneStudent ? "These students are" : "This student is" } already enrolled at your school.
        `
        }
        </p>

        ${ students.map( student => `
        <table>
          <tbody>
              <tr>
                <td>Student Name</td>
                <td>${combinedName(student)}</td>
              </tr>
              <tr>
                <td>Local ID #</td>
                <td>${emptyGuard(student.localId)}</td>
              </tr>
              <tr>
                <td>Grade</td>
                <td>${emptyGuard(grade(student))}</td>
              </tr>
              ${ student.schoolCategory === SchoolCategory.Secondary ? `
              <tr>
                <td>Course Recommendations</td>
                <td>${emptyGuard(student.secondaryCourseRecommendations)}</td>
              </tr>
              ` : `
              ${ student.isNewRegistration || student.isPreRegistration ? `
              <tr>
                <td>Program</td>
                <td>REG</td>
              </tr>
              ` : ""}
              ` }
              <tr>
                <td>Overall STEP Level</td>
                <td>${emptyGuard(overallStepLevel(student))}</td>
              </tr>
              <tr>
                <td>Notes</td>
                <td>${emptyGuard(student.educationComments)}</td>
              </tr>
          </tbody>
        </table>
        `).join("<br>") }
        <br>

        ${ student.isNewRegistration || student.isPreRegistration ? `
        <p class="bold" style="color: blue">The family has completed a hard-copy registration form.</p>
        ` : ""}

        <p class="bold">Please see the Family Reception Centre folder in your school's Laserfiche repository for the following:</p>
        <ul>
          ${student.isNewRegistration || student.isPreRegistration ? `
          <li>Hard-copy Application for Admission Registration Form</li>
          <li>OCDSB 031</li>
          ` : ""}
          <li>Previous school reports</li>
          <li>Initial Assessment STEP sheets highlighted with STEP levels.</li>
        </ul>

        <p class="bold">The Student Profile in Aspen will include:</p>
        <ul>
          ${student.isNewRegistration || student.isPreRegistration ? `
          <li>Family contact information</li>
          ` : ""}
          <li>ESL/ELD Report and Step levels in the ELL Tracker tab</li>
          ${ student.schoolCategory === SchoolCategory.Secondary ? `
          <li>Secondary school course recommendations for English and Math</li>
          ` : "" }
          <li>Educational background can be found within the ELL tracker, in the "Educational Background" box.</li>
        </ul>

        ${student.isNewRegistration || student.isPreRegistration ? `
        <p class="bold">Next steps:</p>
        <ul>
          <li>Please share this important information with the appropriate staff, such as the classroom teacher(s), VP, LST, Guidance, ESL Lead / ESL/ELD Itinerant Teacher, etc.</li>
        </ul>

        <p>Thank you in advance for welcoming this family to your school community. Please email me if you have any questions.</p>
        ` : ""}
      </body>
    </html>
  `;
}

function combinedName(student: Student) {
  if (
    student.firstName.length === 0 ||
    student.lastName.length === 0 ||
    student.legalFirstName.length === 0 ||
    student.legalLastName.length === 0
  ) {
    return emptyGuard("");
  }

  const isLegalNameSameAsPreferred =
    student.legalFullName === `${student.lastName}, ${student.firstName} ${student.middleName}`.trim();

  return `${student.displayName}${isLegalNameSameAsPreferred ? "" : ` (${student.legalFullName})`}`;
}

function grade(student: Student) {
  const gradeNum = parseInt(student.grade);
  return (isNaN(gradeNum) ? student.grade : `Grade ${gradeNum}`)
    + (student.isPreRegistration ? " (New School Year)" : "");
}

function overallStepLevel(student: Student) {
  switch (student.languageCategory) {
    case LanguageCategory.Native: return "No placement on ESL/ELD STEP Continuum needed";
    case LanguageCategory.ESL: return `ESL STEP ${student.overallStep}`;
    case LanguageCategory.ELD: return `ELD STEP ${student.overallStep}`;
    case LanguageCategory.Unknown: return "";
  }
}

function emptyGuard(value: string) {
  return value.length > 0 ? value : `<span class="error">[MISSING]</span>`;
}
