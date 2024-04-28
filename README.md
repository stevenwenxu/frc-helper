# FRC Helper

The work at the Family Reception Centre, OCDSB has tremendously meaningful impact to newcomers. However, there are lots of high friction points in the software provided by the school board. This is a Chrome extension that can boost productivity for workers, allowing them to spend less time on toil, and more time on guiding and helping families, thereby enrolling students to schools sooner.

### Background

The typical student registration workflow involves a lot of copy-pasting between two websites, [School Interviews](https://www.schoolinterviews.com.au/) and [Aspen](https://ocdsb.myontarioedu.ca/aspen). This includes students and parents names, addresses, phone numbers, emails, and many more. Unfortunately, many information cannot be directly pasted as they need reformatting, such as splitting names into parts, converting names from ALL CAPS to TitleCase, correcting addresses and variously formatted dates, etc. Contents usually need to be copied and pasted into multi-step forms, and repeated for each student and each parent in the family.

In addition, many form elements in Aspen are derived or repeated data in nature, choosing an option from a dropdown menu can infer a couple other required dropdowns or text field contents. Some contents, such as the math assessment for secondary students, require a paper worksheet with reference tables to reach the correct conclusion, and manually typing out the commentary can be time consuming.

Lastly, an email needs to be created from a handful of templates. This requires pasting and substituting names, pronouns, and all the other information already filled in Aspen again.

These extraneous tasks require careful attention to detail, are really error-prone, and unnecessarily consume a significant amount of time in the day.

### Features

This Chrome extension makes everything easy by providing the following components.

#### School Interviews
- An "Add new family" button is injected into the student page on School Interview, which activates the parser.
- The parser fetches all relevant data of the family from the webpage, and saves it in local storage.
- A side panel opens, displaying the parsed result.
- If the parser makes any mistakes, the UI allows manual correction with autosave.
- If School Interviews do not have details for every family member, the UI enables users to create a new family member by duplicating an existing one.

#### Popup window
- Clicking the extension icon opens a popup window, which displays all parsed families in reverse chronological order.
- Each family page contains a "Fill" button for each family member. When supported Aspen pages are open, details of the selected student/parent are filled into the corresponding form elements.
- The "Fill" button prevents simple mistakes using alerts, such as when attempting to fill student info into the form of a parent, and vice versa. It also prevents overwriting existing data when necessary.
- The "Fill" button sets up hooks on certain form elements, so that other form elements that are derived or repeated in nature are updated automatically.
- The "Fill" button also picks up relevant family details along the way, which are not in School Interviews. They are used for email generation.
- For students in secondary schools, a Math Assessment button is available to bring up the worksheet. This digitizes the paper-based reference tables that assessors need. It also generates a preview of the test result commentary.
- Each student page has a "Generate email" button, which picks the correct template and combines all students in the family who are going to the same school. The email is fully populated if every page is filled using FRC Helper, otherwise it highlights missing fields that it didn't pick up.
- Families can be manually deleted once they're processed. Additionally, they are automatically cleaned up after 10 days to reduce clutter and respect privacy.

A demo video is available on request.


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

#### Credit

Project setup inspiration: https://github.com/chibat/chrome-extension-typescript-starter
