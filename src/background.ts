import { FamilyRepository } from "./common/family_repository";

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

chrome.action.onClicked.addListener(function(tab) {
  chrome.windows.create({
    url: chrome.runtime.getURL("/html/popup.html"),
    type: "popup",
    width: 600,
    height: 800,
  });
});
