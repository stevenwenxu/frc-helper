import { DetailsPageNavHelpers } from "./helpers/details_page_nav_helper";
import { RawData } from "./models/raw_data";

function insertButton(table: HTMLTableElement) {
  // if family exists, view family
  // otherwise, add new family
  fetch(chrome.runtime.getURL('/html/details_page.html')).then(r => r.text()).then(html => {
    table.insertAdjacentHTML('beforebegin', html);

    const people = new RawData(table).parse();
    const container = document.getElementsByClassName("offcanvas-body")[0];
    container.innerHTML = DetailsPageNavHelpers.generate(people);
  });
}

const table: HTMLTableElement | null = document.querySelector("#container > div > section > table");
if (table) {
  insertButton(table);
}
