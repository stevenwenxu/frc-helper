import { setupDetailsPage } from "./details_page_entry";
import { setupSchedule } from "./schedule";

if (/\/.*\/parents\/\d+\/details$/.test(window.location.pathname)) {
  setupDetailsPage();
} else if (/\/.*\/\d+/.test(window.location.pathname)) {
  setupSchedule();
}
