import { FamilyRepository } from "./school_interviews/helpers/family_repository";

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("storage cleanup", {
    // once a day
    periodInMinutes: 24 * 60,
    delayInMinutes: 2
  });
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "storage cleanup") {
    FamilyRepository.clearOldFamilies();
  }
});
