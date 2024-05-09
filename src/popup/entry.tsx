import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Popup from "./popup";
import { MainContentTypeProvider } from './main_content_context';

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <MainContentTypeProvider>
      <Popup version={document.head.dataset.version ?? "unknown"}/>
    </MainContentTypeProvider>
  </StrictMode>
);
