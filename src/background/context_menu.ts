import { supportedPathsForPersonType } from "../aspen/helpers/supported_path";
import { FamilyRepository } from "../common/family_repository";
import { Family } from "../common/models/family";

export async function setupContextMenu() {
  chrome.contextMenus.removeAll();

  const families = await FamilyRepository.getFamilies();
  families.sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());

  const studentOnlyUrls = [
    "https://ecm.ocdsb.ca/laserfiche/*",
    ...supportedPathsForPersonType("studentOnly"),
  ];
  const parentOnlyUrls = supportedPathsForPersonType("parentOnly");
  const mixedUrls = supportedPathsForPersonType("both");
  createMenuForPersonTypes(families, ["student"], studentOnlyUrls, "student");
  createMenuForPersonTypes(families, ["parent"], parentOnlyUrls, "parent");
  createMenuForPersonTypes(families, ["student", "parent"], mixedUrls, "mixed");
}

function createMenuForPersonTypes(
  families: Family[],
  personTypes: ("student" | "parent")[],
  documentUrlPatterns: string[],
  suffix: string
) {
  const parentMenu = chrome.contextMenus.create({
    documentUrlPatterns,
    id: `top_level_${suffix}`,
    title: `Fill ${personTypes.join("/")}`,
  });

  for (const family of families) {
    const familyItem = chrome.contextMenus.create({
      title: family.displayName,
      id: `${family.uniqueId}_${suffix}`,
      parentId: parentMenu,
    });

    if (personTypes.includes("student")) {
      for (const [index, student] of family.students.entries()) {
        chrome.contextMenus.create({
          title: student.firstNameWithGrade,
          id: `${family.uniqueId}-${index}_${suffix}`,
          parentId: familyItem,
        });
      }
    }

    if (personTypes.length === 2) {
      chrome.contextMenus.create({
        type: "separator",
        id: `${family.uniqueId}-separator_${suffix}`,
        parentId: familyItem,
      });
    }

    if (personTypes.includes("parent")) {
      for (const [index, parent] of family.parents.entries()) {
        chrome.contextMenus.create({
          title: `Parent ${index + 1}: ${parent.firstName}`,
          id: `${family.uniqueId}|${index}_${suffix}`,
          parentId: familyItem,
        });
      }
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
