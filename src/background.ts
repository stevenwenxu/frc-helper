import { FamilyRepository } from "./common/family_repository";
import { OptionsRepository } from "./common/options_repository";

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

  const displayMode = await OptionsRepository.getDisplayMode();
  switch (displayMode) {
    case "tab":
      chrome.tabs.create({ url: popupURL });
      break;
    case "popup":
      chrome.windows.create({
        url: popupURL,
        type: "popup",
        width: 600,
        height: 900,
      });
      break;
  }
});
