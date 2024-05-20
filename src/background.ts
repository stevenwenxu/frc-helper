import { FamilyRepository } from "./common/family_repository";
import { OptionsRepository } from "./common/options_repository";

console.log("Background script loaded");

chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create("storage cleanup", {
    // once a day
    periodInMinutes: 24 * 60,
    delayInMinutes: 2
  });

  await setupContextMenu();
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "storage cleanup") {
    FamilyRepository.clearOldFamilies();
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  await setupOpenPopup();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.id) {
    console.error("Context menu clicked without tab");
    return;
  }

  const [familyId, studentIndex] = String(info.menuItemId).split("-");
  await fillStudentInTab(tab.id, familyId, Number(studentIndex));
});

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === "local") {
    await setupContextMenu();
  }
});

async function setupOpenPopup() {
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

async function setupContextMenu() {
  chrome.contextMenus.removeAll();

  const parentMenu = chrome.contextMenus.create({
    documentUrlPatterns: ["https://ecm.ocdsb.ca/laserfiche/*"],
    id: "top_level",
    title: "Fill student",
  });

  const families = await FamilyRepository.getFamilies();
  families.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());

  for (const family of families) {
    const familyItem = chrome.contextMenus.create({
      title: family.displayName,
      id: family.uniqueId,
      parentId: parentMenu,
    });

    for (const [index, student] of family.students.entries()) {
      chrome.contextMenus.create({
        title: student.firstNameWithGrade,
        id: `${family.uniqueId}-${index}`,
        parentId: familyItem,
      });
    };
  }
}

async function fillStudentInTab(tabId: number, familyId: string, studentIndex: number) {
  const fillResponse = await chrome.tabs.sendMessage(tabId, {
    familyId: familyId,
    studentIndex: studentIndex,
  });

  if (fillResponse.type === "fillResponse") {
    switch (fillResponse.message) {
      case "familyNotFound":
        console.error("This family has been deleted. Please reopen the context menu.");
        break;
      case "unknownFillDestination":
        console.log("Unknown fill destination");
        break;
      case "ok":
        break;
      default:
        console.error("Unknown fill response message:", fillResponse.message);
        break;
    }
  } else {
    console.error("Unknown fill response:", fillResponse);
  }
}
