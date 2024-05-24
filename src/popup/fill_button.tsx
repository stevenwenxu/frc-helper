import Button from "react-bootstrap/Button";
import { Parent, Student } from "../common/models/person";
import { useFamilyContext } from "./family_context";
import { SupportedPath, supportedUrls } from "../aspen/helpers/supported_path";
import { useState } from "react";
import "./fill_button.css";

type ButtonStatus = "idle" | "filling" | "success" | "failed";

export default function FillButton() {
  const { selectedFamilyId, selectedPeopleIndex, selectedPerson } = useFamilyContext();
  const [status, setStatus] = useState<ButtonStatus>("idle");

  if (!selectedFamilyId || selectedPeopleIndex === undefined || !selectedPerson) {
    console.error("FillButton: unexpected state", selectedFamilyId, selectedPeopleIndex, selectedPerson);
    return null;
  }

  let buttonText = <span></span>;
  switch (status) {
    case "idle":
    case "filling":
      buttonText = <span>Fill</span>;
      break;
    case "success":
      buttonText = <Checkmark />;
      break;
    case "failed":
      buttonText = <Cross />;
  }

  const handleClick = async () => {
    try {
      setStatus("filling");

      const {tabId, pathname, context} = await identifyTabs(selectedPerson);

      const response = await chrome.tabs.sendMessage(tabId, {
        type: "fillAspen",
        familyId: selectedFamilyId,
        personIndex: selectedPeopleIndex,
        pathname: pathname,
        context: context
      });

      if (response !== "ok" && response !== "refreshRequired") {
        setStatus("failed");
      } else {
        setStatus("success");
      }
    } catch (error) {
      setStatus("failed");
      alert((error as Error).message);
    } finally {
      setTimeout(() => {
        setStatus("idle");
      }, 1500);
    }
  }

  return (
    <Button
      variant="outline-primary"
      className={`flex-fill ${status === "idle" ? "" : "btn-checkmark"}`}
      onClick={handleClick}
      disabled={status !== "idle"}
    >
      {buttonText}
    </Button>
  )
}

function Checkmark() {
  return (
    <svg className="checkmark_container checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className="circle checkmark_circle" cx="26" cy="26" r="25" fill="none"/>
      <path className="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
  );
}

function Cross() {
  return (
    <svg className="checkmark_container cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className="circle cross_circle" cx="26" cy="26" r="25" fill="none"/>
      <path className="cross_check" fill="none" d="M16 16 36 36 M36 16 16 36"/>
    </svg>
  );
}

async function identifyTabs(selectedPerson: Parent | Student) {
  const tabs = await chrome.tabs.query({ active: true, url: supportedUrls });
  console.log("State of tabs", tabs.map(tab => [tab.url, tab.active]));

  if (tabs.length === 0) {
    throw new Error("You don't have any active Aspen pages to fill.");
  }

  const tab = tabs.at(-1)!;
  console.log("Filling tab: ", tab.url);

  const personType = selectedPerson instanceof Student ? "student" : "parent";
  const url = new URL(tab.url!);
  const pathname = url.pathname;
  const context = url.searchParams.get("context");
  const expected = expectedPersonType(pathname);
  if (!expected.includes(personType)) {
    throw new Error(`You selected a ${personType}, but the form is for a ${expected.join(" or ")}.`);
  }

  return {tabId: tab.id!, pathname, context};
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
