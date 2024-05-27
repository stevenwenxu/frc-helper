# FRC Helper

The work at the Family Reception Centre, OCDSB has tremendously meaningful impact to newcomers. However, there are lots of high friction points in the software provided by the school board. This is a Chrome extension that can boost productivity for workers, allowing them to spend less time on toil, and more time on guiding and helping families, thereby enrolling students to schools sooner.

### Background

The typical student registration workflow involves a lot of copy-pasting between two websites, [School Interviews](https://www.schoolinterviews.com.au/) and [Aspen](https://ocdsb.myontarioedu.ca/aspen). This includes students and parents names, addresses, phone numbers, emails, and many more. Unfortunately, many information cannot be directly pasted as they need reformatting, such as splitting names into parts, converting names from ALL CAPS to TitleCase, correcting addresses and variously formatted dates, etc. Contents usually need to be copied and pasted into multi-step forms, and repeated for each student and each parent in the family.

Additionally, many elements in Aspen are derived or repeated data in nature. Choosing an option from a dropdown menu should infer a couple other required dropdowns values or text field contents.

Some tasks, such as determining the appropriate English and math assessments, require the use of elaborated reference tables depending on the student's intended grade, their last completed grade, their current skillsets, and post-secondary education preference. To reach the correct recommendations and conclusions, these results are weighted and compared before writing a formulaic summary.

Lastly, an email needs to be created from a handful of templates. This requires pasting and substituting names, pronouns, and all the other information already filled in Aspen again.

These extraneous tasks require careful attention to detail, are really error-prone, and unnecessarily consume a significant amount of time in the day.

### Features

This Chrome extension makes everything easy by providing the following components.

#### School Interviews
- An "Add new family" button is injected into the student page on School Interviews, which parses all relevant data of the family from the webpage, saves them, and displays the family details in a side panel.
- The side panel also allows editing, in case the information needs to be corrected.
- If School Interviews do not have details for every family member, the UI enables users to create a new family member by duplicating an existing one.

#### Popup window
- Clicking the extension icon opens a popup window, which displays all families in reverse chronological order.
- Each family page contains a "Fill" button for each family member. When supported Aspen pages are open, details of the selected student/parent are filled into the corresponding form elements.
- The "Fill" button prevents simple mistakes using alerts and confirmations, such as when attempting to fill the wrong student, filling student info into the form of a parent, and more. It also prevents overwriting existing data when necessary.
- The "Fill" button sets up hooks on certain form elements, so that other form elements that are derived or repeated in nature are updated automatically.
- The "Fill" button also picks up relevant family details along the way, which are not in School Interviews. They are used for email generation.
- For students in secondary schools, a Math Assessment button is available to bring up the worksheet. This digitizes the paper-based reference tables that assessors need. It also generates a preview of the test result commentary.
- The "OCDSB 031" and "STEP" buttons for students generate respective PDF forms with student and parent information filled in.
- Each student page has a "Preview email" button, which picks the correct template and combines all students in the family who are going to the same school. The email is fully populated if every page is filled using FRC Helper, otherwise it highlights missing fields that it didn't pick up.
- Families can be manually deleted once they're processed. Additionally, they are automatically cleaned up after 10 days to reduce clutter and respect privacy.

### Development

#### Prerequisites

* node
* npm

#### Setup

```
npm install
```

#### Build

```
npm run build
```

#### Build in watch mode

```
npm run watch
```

#### Load extension to chrome

Load `dist` directory

#### Lint

```
npx eslint .
```

#### Debug React views

```
npx react-devtools
```

#### Credit

Project setup inspiration: https://github.com/chibat/chrome-extension-typescript-starter
