import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SidePanel from "./side_panel";

export function setupDetailsPage() {
  const table = document.querySelector<HTMLTableElement>("#container > div > section > table");

  const app = document.createElement("div");
  app.id = "react-root";

  if (table) {
    table.insertAdjacentElement("beforebegin", app);
  }

  const root = createRoot(document.getElementById("react-root")!);
  root.render(
    <StrictMode>
      <SidePanel />
    </StrictMode>
  );
}
