import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SidePanel from "./side_panel";

export function setupSidePanel() {
  const table = document.querySelector<HTMLTableElement>("#container > div > section > table");

  const app = document.createElement("div");
  app.id = "react-root";

  if (table) {
    table.insertAdjacentElement("beforebegin", app);
  }

  const root = createRoot(document.getElementById("react-root")!);
  root.render(
    <StrictMode>
      <SidePanel familyId={getFamilyIdFromURL()}/>
    </StrictMode>
  );
}

function getFamilyIdFromURL() {
  const pathnames = window.location.pathname.split("/");
  if (pathnames.length === 5) {
    return pathnames[3];
  }

  throw new Error("details_page.ts: Could not get family id.");
}
