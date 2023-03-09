import { Student } from "../../common/models/person";
import { SchoolCategory } from "../../common/models/school_category";

export function emailSubject(students: Student[]) {
  const formatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
  const initials = formatter.format(students.map(s => s.initials));
  const student = students[0];
  const type = student.pendingTransfer ? "Registration" : "Assessment";
  return `New ${type} ${initials} ${student.targetSchool}`;
}

export function emailBody(students: Student[]) {
  const formatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
  const lastNames = formatter.format([...new Set(students.map(s => s.lastName))]);
  const languages = [...new Set(students.map(s => s.homeLanguage))];
  const languagesText = formatter.format(languages);
  const student = students[0];
  const school = student.targetSchool;
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
        </style>
      </head>
      <body>
        <p>Dear ${school} Team,</p>

        ${ student.pendingTransfer ? `
        <p>We had the pleasure of meeting the ${lastNames} family recently at the Family Reception Centre. Based on the home address provided during the intake meeting, their ${moreThanOneStudent ? "children have" : "child has"} been activated in Aspen in the "FRC Holding School" and ${moreThanOneStudent ? "are" : "is"} ready to transfer to your school.</p>
        ` : `
        <p>We had the pleasure of meeting the ${lastNames} family recently at the Family Reception Centre. ${moreThanOneStudent ? "These students are" : "This student is" } already enrolled at your school.</p>
        `}

        ${ student.pendingTransfer ? `
        <p class="bold" style="color: blue">The family has completed a hard-copy registration form, attached.</p>

        <p class="bold" style="color: blue">The family has been instructed to complete the online registration and supporting documents form. They may require support in completing these forms.</p>

        <p>The family speaks ${languagesText}. It is recommended that you invite an MLO who speaks ${languages.length > 1 ? "these languages" : "this language"} to support your conversations. If your school does not have an MLO, please request one here: <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=BtVrYC9iWEK_-fzRubyWjjLYbNjq7tRCuw6D_vq-mF5UQ0FVVFI3WkNVQUNVRzJWUDRYVElOTEVIOS4u">Multicultural Liaison Officer (MLO) Request Form</a></p>
        ` : ``}

        ${ students.map( student => `
        <table>
          <tbody>
              <tr>
                <td>Student Name</td>
                <td>${student.lastName}, ${student.firstName}</td>
              </tr>
              <tr>
                <td>Local ID #</td>
                <td>${student.localId}</td>
              </tr>
              <tr>
                <td>Grade</td>
                <td>${student.grade}</td>
              </tr>
              ${ student.schoolCategory === SchoolCategory.Secondary ? `
              <tr>
                <td>Course Recommendations</td>
                <td>${student.secondaryCourseRecommendations}</td>
              </tr>
              ` : "" }
              <tr>
                <td>Overall STEP Level</td>
                <td>${student.overallStepLevel}</td>
              </tr>
              <tr>
                <td>Notes</td>
                <td>${student.educationComments}</td>
              </tr>
          </tbody>
        </table>
        `).join("<br>") }
        <br>

        <p class="bold">The Student Profile in Aspen will include:</p>
        <ul>
          ${student.pendingTransfer ? `
          <li>Family contact information</li>
          ` : ``}
          <li>ESL/ELD Report and Step levels in FRC Tracker</li>
          ${ student.schoolCategory === SchoolCategory.Secondary ? `
          <li>Secondary school course recommendations for English and Math</li>
          ` : "" }
        </ul>

        ${student.pendingTransfer ? `
        <p class="bold">Please find attached the following forms:</p>
        <ul>
          <li>Hard-copy Application for Admission Registration Form</li>
          <li>OCDSB 031</li>
          <li>Previous school reports</li>
          <li>Initial Assessment STEP sheets highlighted with STEP levels.</li>
        </ul>

        <p class="bold">Next steps:</p>
        <ul>
          <li>Please share this important information with the appropriate staff, such as the classroom teacher(s), VP, LST, Guidance, ESL Lead / ESL/ELD Itinerant Teacher, etc.</li>
        </ul>

        <p>Thank you in advance for welcoming this family to your school community. Please email me if you have any questions.</p>
        ` : ``}
      </body>
    </html>
  `;
}
