function extractData(table: HTMLTableElement) {
  for (const row of Array.from(table.rows)) {
    if (row.cells.length != 2) {
      throw new Error("Cannot find any data here.");
    }

    const key = row.cells[0].innerText.trim();
    const value = row.cells[1].innerText.trim();
    console.log(`Key: ${key}, Value: ${value}`);
  }
}

function insertButton(table: HTMLTableElement) {
  const button = document.createElement("button");
  button.innerText = "Copy data";
  button.addEventListener("click", function (event) {
    event.preventDefault();
    extractData(table);
  });
  table.parentElement?.insertBefore(button, table);
}

const table: HTMLTableElement | null = document.querySelector(".content > table");
if (table) {
  insertButton(table);
}
