import { supportedUrls } from "../aspen/helpers/supported_path";
import { FamilyRepository } from "../common/family_repository";

export async function setupContextMenu() {
  chrome.contextMenus.removeAll();

  const parentMenu = chrome.contextMenus.create({
    documentUrlPatterns: ["https://ecm.ocdsb.ca/laserfiche/*", ...supportedUrls],
    id: "top_level",
    title: "Fill", // TODO: combination of fill/fetch, student/parent
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
    chrome.contextMenus.create({
      type: "separator",
      id: `${family.uniqueId}-separator`,
      parentId: familyItem,
    });
    for (const [index, parent] of family.parents.entries()) {
      chrome.contextMenus.create({
        title: `Parent ${index + 1}: ${parent.firstName}`,
        id: `${family.uniqueId}|${index}`,
        parentId: familyItem,
        visible: false,
      });
    }
  }
}


export async function fillStudentInTab(tabId: number, familyId: string, studentIndex: number) {
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
