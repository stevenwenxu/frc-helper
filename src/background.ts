import { FamilyRepository } from "./common/family_repository";
import { Student } from "./common/models/person";
import { OptionsRepository } from "./common/options_repository";

console.log("Background script loaded");

// Track Aspen menu IDs so we can remove them without chrome.contextMenus.getAll
const aspenMenuIds: string[] = [];

function trackAspenMenuId(id: string | number) {
  const strId = String(id);
  if (!aspenMenuIds.includes(strId)) {
    aspenMenuIds.push(strId);
  }
}

async function removeAspenMenus() {
  for (const id of aspenMenuIds) {
    try {
      await chrome.contextMenus.remove(id);
    } catch {
      // already removed or invalid, ignore
    }
  }
  aspenMenuIds.length = 0;
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create("storage cleanup", {
    // once a day
    periodInMinutes: 24 * 60,
    delayInMinutes: 2
  });

  await setupLaserficheMenus();
  await setupAspenMenus();
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

  const menuItemId = String(info.menuItemId);

  // Aspen leaf IDs use "|" separator, Laserfiche uses "-"
  if (menuItemId.includes("|")) {
    const pipeIndex = menuItemId.indexOf("|");
    const familyId = menuItemId.substring(0, pipeIndex).split("::")[1];
    const personIndex = Number(menuItemId.substring(pipeIndex + 1));
    await fillAspenInTab(tab.id, familyId, personIndex);
  } else {
    const [familyId, studentIndex] = menuItemId.split("-");
    await fillStudentInTab(tab.id, familyId, Number(studentIndex));
  }
});

let storageChangeTimer: number | null = null;
chrome.storage.onChanged.addListener(async (_changes, namespace) => {
  if (namespace === "local") {
    if (storageChangeTimer != null) clearTimeout(storageChangeTimer);
    storageChangeTimer = self.setTimeout(async () => {
      storageChangeTimer = null;
      removeAspenMenus();
      await setupLaserficheMenus();
      await setupAspenMenus();
    }, 300);
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

async function setupLaserficheMenus() {
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

type AspenPathConfig = {
  path: string;
  contexts: (string | null)[];
  personTypes: ("student" | "parent")[];
  action: "fill" | "fetch";
};

const aspenPathConfigs: AspenPathConfig[] = [
  { path: "/aspen/studentRegistration0.do", contexts: [null], personTypes: ["student"], action: "fill" },
  { path: "/aspen/studentRegistration1.do", contexts: [null], personTypes: ["student"], action: "fill" },
  { path: "/aspen/studentRegistration2.do", contexts: [null], personTypes: ["student"], action: "fill" },
  { path: "/aspen/multiplePersonAddressChildDetail.do", contexts: ["person.address.popup", "person.phone.popup"], personTypes: ["student", "parent"], action: "fill" },
  { path: "/aspen/addRecord.do", contexts: [null], personTypes: ["parent"], action: "fill" },
  { path: "/aspen/contactDetail.do", contexts: [null], personTypes: ["parent"], action: "fill" },
  { path: "/aspen/childDetail.do", contexts: ["extracurricular.std.edu.bkgd.list.detail", "extracurricular.std.ell.tracker.list.detail", "extracurricular.ell.list.detail.ocdsb"], personTypes: ["student"], action: "fill" },
  { path: "/aspen/studentPersonAddressDetail.do", contexts: [null], personTypes: ["student"], action: "fetch" },
  { path: "/aspen/studentTransfer.do", contexts: [null], personTypes: ["student"], action: "fill" },
];

function buildUrlPattern(path: string): string {
  return `https://ocdsb.myontarioedu.ca${path}*`;
}

async function setupAspenMenus() {
  const families = await FamilyRepository.getFamilies();
  families.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());

  for (const config of aspenPathConfigs) {
    const urlPattern = buildUrlPattern(config.path);

    for (const personType of config.personTypes) {
      const hasPeople = personType === "student"
        ? families.some(f => f.students.length > 0)
        : families.some(f => f.parents.length > 0);

      if (!hasPeople) continue;

      const actionLabel = config.action === "fill" ? "Fill" : "Fetch";
      const label = personType === "student" ? `${actionLabel} student` : `${actionLabel} parent`;

      // Top-level "FRC Helper - Fill student" menu
      const topMenuId = chrome.contextMenus.create({
        id: `aspen_${config.path.replace(/\//g, "_")}_${personType}`,
        title: `FRC Helper - ${label}`,
        documentUrlPatterns: [urlPattern],
      });
      trackAspenMenuId(topMenuId);

      for (const family of families) {
        const people = personType === "student" ? family.students : family.parents;
        if (people.length === 0) continue;

        const familyMenuId = chrome.contextMenus.create({
          title: family.displayName,
          id: `${topMenuId}_${family.uniqueId}`,
          parentId: topMenuId,
        });
        trackAspenMenuId(familyMenuId);

        for (const [idx, person] of people.entries()) {
          const studentCount = family.students.length;
          const personIndex = personType === "student" ? idx : studentCount + idx;
          const title = personType === "student"
            ? (person as Student).firstNameWithGrade
            : `Parent ${idx + 1}`;

          chrome.contextMenus.create({
            title,
            id: `${topMenuId}::${family.uniqueId}|${personIndex}`,
            parentId: familyMenuId,
          });
        }
      }
    }
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

async function fillAspenInTab(tabId: number, familyId: string, personIndex: number) {
  const response = await chrome.tabs.sendMessage(tabId, {
    type: "fillAspen",
    familyId: familyId,
    personIndex: personIndex,
  });

  switch (response) {
    case "ok":
      break;
    case "refreshRequired":
      // Popup will refresh via runtime message
      break;
    case "wrongPersonType":
      console.error("Wrong person type selected for this page");
      break;
    case "familyNotFound":
      console.error("This family has been deleted. Please reopen the context menu.");
      break;
    case "unknownPage":
      console.error("Unsupported Aspen page");
      break;
    default:
      console.error("Unknown fill response:", response);
  }
}
