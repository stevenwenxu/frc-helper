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

chrome.action.onClicked.addListener(async function(tab) {
  const popupURL = chrome.runtime.getURL("/html/popup.html");

  const openedWindows = await chrome.windows.getAll({ populate: true, windowTypes: ["popup"] });
  for (const openedWindow of openedWindows) {
    for (const tab of (openedWindow.tabs || [])) {
      if (tab.url === popupURL) {
        chrome.windows.update(openedWindow.id!, { focused: true });
        return;
      }
    };
  };

  chrome.windows.create({
    url: popupURL,
    type: "popup",
    width: 600,
    height: 900,
  });
});
