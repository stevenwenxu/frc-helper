import { OptionsRepository } from "../common/options_repository";

export async function setupOpenPopup() {
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
}
