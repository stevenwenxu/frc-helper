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

  const openedWindows = await chrome.windows.getAll({ populate: true });
  for (const openedWindow of openedWindows) {
    for (const tab of (openedWindow.tabs || [])) {
      if (tab.url === popupURL) {
        chrome.windows.update(openedWindow.id!, { focused: true });
        chrome.tabs.update(tab.id!, { active: true });
        return;
      }
    };
  };

  chrome.tabs.create({ url: popupURL });
});
