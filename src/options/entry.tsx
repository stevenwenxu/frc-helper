import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import Options from './options';

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Options />
  </StrictMode>
);
