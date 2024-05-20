import Button from "react-bootstrap/Button";
import { Parent, Student } from "../common/models/person";
import { useFamilyContext } from "./family_context";
import { SupportedPath, supportedUrls } from "../aspen/helpers/supported_path";

export default function FillButton() {
  const { selectedFamilyId, selectedPeopleIndex, selectedPerson } = useFamilyContext();

  if (!selectedFamilyId || selectedPeopleIndex === undefined || !selectedPerson) {
    console.error("FillButton: unexpected state", selectedFamilyId, selectedPeopleIndex, selectedPerson);
    return null;
  }

  return (
    <Button
      variant="outline-primary"
      className="flex-fill"
      onClick={() => { onClick(selectedFamilyId, selectedPeopleIndex, selectedPerson) }}
    >
      Fill
    </Button>
  )
}

async function onClick(
  selectedFamilyId: string,
  selectedPeopleIndex: number,
  selectedPerson: (Parent | Student)
) {
  const tabs = await chrome.tabs.query({ active: true, url: supportedUrls });
  console.log("State of tabs", tabs.map(tab => [tab.url, tab.active]));

  if (tabs.length === 0) {
    alert("You don't have any active Aspen pages to fill.");
    return;
  }

  const tab = tabs.at(-1)!;
  console.log("Filling tab: ", tab.url);

  const personType = selectedPerson instanceof Student ? "student" : "parent";
  const url = new URL(tab.url!);
  const pathname = url.pathname;
  const context = url.searchParams.get("context");
  const expected = expectedPersonType(pathname);
  if (!expected.includes(personType)) {
    alert(`You selected a ${personType}, but the form is for a ${expected.join(" or ")}.`);
    return;
  }

  chrome.tabs.sendMessage(tab.id!, {
    type: "fillAspen",
    familyId: selectedFamilyId,
    personIndex: selectedPeopleIndex,
    pathname: pathname,
    context: context
  });
}

function expectedPersonType(pathname: string) {
  switch (pathname) {
    case SupportedPath.StudentRegistration0:
    case SupportedPath.StudentRegistration1:
    case SupportedPath.StudentRegistration2:
    case SupportedPath.ChildDetail:
    case SupportedPath.StudentPersonAddressDetail:
      return ["student"];
    case SupportedPath.MultiplePersonAddressChildDetail:
      return ["student", "parent"];
    case SupportedPath.AddRecord:
    case SupportedPath.ContactDetail:
      return ["parent"];
    default:
      console.log("Unknown path:", pathname);
      return [];
  }
}
