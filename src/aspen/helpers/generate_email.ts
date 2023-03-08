import { Student } from "../../common/models/person";
import { SchoolCategory } from "../../common/models/school_category";

export function emailSubject(students: Student[]) {
  return `New Assessment ${ students.map(s => s.initials).join(" and ") } ${students[0].targetSchool}`;
}

export function emailBody(students: Student[]) {
  const school = students[0].targetSchool;
  const lastNames = [...new Set(students.map(s => s.lastName))].join(" and ");

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
            width: 25%;
          }
        </style>
      </head>
      <body>
        <p>Dear ${school} Team,</p>
        <p>We had the pleasure of meeting the ${lastNames} family recently at the Family Reception Centre. This student is already enrolled at your school.</p>
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
        <p style="font-weight: bold;">The Student Profile in Aspen will include:</p>
        <ul>
          <li>ESL Report and Step levels in FRC Tracker</li>
          ${ students[0].schoolCategory === SchoolCategory.Secondary ? `
          <li>Secondary school course recommendations for English and Math</li>
          ` : "" }
        </ul>
      </body>
    </html>
  `;
}
