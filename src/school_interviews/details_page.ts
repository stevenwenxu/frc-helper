import { RawData } from "./models/raw_data";

function extractData(table: HTMLTableElement) {
  let result = new RawData();

  for (const row of Array.from(table.rows)) {
    if (row.cells.length != 2) {
      continue;
    }

    const key = row.cells[0].innerText.trim();
    const value = row.cells[1].innerText.trim();
    switch (key) {
      case "PARENT's Name":
        result.parentsName = value;
        break;
      case "Email":
        result.email = value;
        break;
      case "Phone":
        result.phone = value;
        break;
      case "Address":
        result.address = value;
        break;
      case "Immigration Status/ First Language":
        result.immigrationStatusFirstLanguage = value;
        break;
      case "Extra NOTES":
        result.notes = value;
        break;
      case "Students":
        result.students.push(value);
        break;
    }
  }

  return result;
}

function insertButton(table: HTMLTableElement) {
  // if family exists, view family
  // otherwise, add new family
  fetch(chrome.runtime.getURL('/html/details_page.html')).then(r => r.text()).then(html => {
    table.insertAdjacentHTML('beforebegin', html);

    const container = document.getElementsByClassName("offcanvas-body")[0];
    fillContainer(container, table);
  });
}

function fillContainer(container: Element, table: HTMLTableElement) {
  const people = extractData(table).parse();
  console.log(people);
}

const table: HTMLTableElement | null = document.querySelector("#container > div > section > table");
if (table) {
  insertButton(table);
}
