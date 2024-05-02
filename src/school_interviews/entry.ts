import { setupSidePanel } from "./side_panel_entry";
import { setupSchedule } from "./schedule";

if (/\/.*\/parents\/\d+\/details$/.test(window.location.pathname)) {
  setupSidePanel();
} else if (/\/.*\/\d+/.test(window.location.pathname)) {
  setupSchedule();
}
