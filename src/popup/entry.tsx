import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Popup from "./popup";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <Popup version={document.head.dataset.version ?? "unknown"}/>
  </StrictMode>
);
