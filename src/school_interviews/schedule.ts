function formatDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short", day: "numeric", month: "short" });
  const parts = formatter.formatToParts(date);
  const weekday = parts.find(part => part.type === "weekday")!.value;
  const day = parts.find(part => part.type === "day")!.value;
  const month = parts.find(part => part.type === "month")!.value;
  return `${weekday} ${day} ${month}`;
}

function nextBusinessDay() {
  const today = new Date();
  if (today.getDay() === 0) {
    // Sunday -> Monday
    today.setDate(today.getDate() + 1);
  } else if (today.getDay() === 6) {
    // Saturday -> Monday
    today.setDate(today.getDate() + 2);
  }
  return today;
}

const table = document.querySelector<HTMLTableElement>("table.data");
if (table) {
  const headers = Array.from(table.querySelectorAll("tr:has(th)"));
  const todayHeader = headers.filter(tr => tr.textContent!.startsWith(formatDate(nextBusinessDay())))[0];
  if (todayHeader) {
    todayHeader.scrollIntoView({ behavior: "smooth", block: "center" });

    let sibling = todayHeader.nextElementSibling;
    while (sibling && !sibling.matches("tr:has(th)")) {
      (sibling as HTMLElement).style.backgroundColor = "lightyellow";
      sibling = sibling.nextElementSibling;
    }
  } else {
    console.log("No schedule found for today.");
  }
}

// This is to make this file a module.
export {};
