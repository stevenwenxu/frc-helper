import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SidePanel from "./side_panel";
import { RawData } from "./models/raw_data";

export function setupDetailsPage() {
  const table = document.querySelector<HTMLTableElement>("#container > div > section > table")!;

  const app = document.createElement("div");
  app.id = "react-root";

  table.insertAdjacentElement("beforebegin", app);

  const root = createRoot(document.getElementById("react-root")!);
  const familyId = getFamilyIdFromURL();
  root.render(
    <StrictMode>
      <SidePanel familyId={familyId} parseNewFamily={() => parseNewFamily(table, familyId)}/>
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

function parseNewFamily(table: HTMLTableElement, familyId: string) {
  return new RawData(table).parse().withUniqueId(familyId).withVisitDate(new Date())
}
