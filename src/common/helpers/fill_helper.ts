export function setValue(element: HTMLInputElement | null, value: string, replaceExisting = true) {
  if (!element) {
    console.log("Element not found", value);
    return;
  }
  if (element.value.length > 0 && !replaceExisting) {
    element.style.borderColor = "";
    return;
  }

  element.value = value;
  element.style.borderColor = "green";

  element.dispatchEvent(new Event("change"));
  if (element.type === "textarea") {
    element.dispatchEvent(new Event("keyup"));
  }
}
