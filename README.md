# FRC Helper

A Chrome extension that removes unnecessary toil at the Family Reception Centre, OCDSB.

The typical student registration workflow involves a lot of copy-pasting between two websites, [School Interviews](https://www.schoolinterviews.com.au/) and [Aspen](https://ocdsb.myontarioedu.ca/aspen). This includes students and parents names, addresses, phone numbers, emails, date of birth, country of birth, and many more. In addition, many information cannot be simply pasted as they need formatting, such as splitting names into first/middle/last names, converting names from ALL CAPS to TitleCase, formatting addresses and manually-entered dates such that they can be recognized by the system, etc. Contents usually need to be copied and pasted into multi-step forms, and repeated for each student and each parent in the family. These extraneous tasks require careful attention to detail, are really error-prone, and consume a significant amount of time in the day.

This Chrome extension makes everything easy by providing the following components:

### School Interviews
- An "Add new family" button is injected into recognized School Interview pages, which activates the parser.
- The parser converts an HTML Table into structured and formatted data for each family, and saves it in local storage.
- A beautiful UI is injected right into School Interviews to display the parsed result.
- If the parser makes any mistakes, the UI allows manual correction with autosave.
- If School Interviews do not have details for every family member, the UI enables users to create a new family member by duplicating an existing one.

### Aspen
- Clicking on the extension icon opens a popup window, which displays all parsed families in reverse chronological order.
- Each family page contains a "Fill" button for each family member. When supported Aspen pages are open, details of the selected student/parent are filled into the corresponding form elements.
- The "Fill" button prevents simple mistakes using alerts, such as when attempting to fill student info into the form of a parent, and vice versa.
- Stored families are automatically cleaned up after 3 days to reduce clutter and respect privacy.

A demo video is available on request.

## Prerequisites

* node
* npm

## Setup

```
npm install
```

## Build

```
npm run build
```

## Build in watch mode

### terminal

```
npm run watch
```

## Load extension to chrome

Load `dist` directory

## Credit

Project setup inspiration: https://github.com/chibat/chrome-extension-typescript-starter
