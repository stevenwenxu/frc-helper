import { fillStudentInTab, setupContextMenu } from "./context_menu";
import { setupOpenPopup } from "./popup";
import { FamilyRepository } from "../common/family_repository";

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

chrome.action.onClicked.addListener(async () => {
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
