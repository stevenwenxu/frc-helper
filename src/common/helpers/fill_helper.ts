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

export async function setLaserfischeValue(element: HTMLInputElement | null, value: string, delay = false) {
  if (!element) {
    console.log("Element not found", value);
    return;
  }

  if (delay) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  element.value = value;
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.dispatchEvent(new Event("blur", { bubbles: true }));
  element.style.borderColor = "green";
}

export function checkCheckbox(element: HTMLInputElement | null, on: boolean) {
  if (!element) {
    console.log("Checkbox not found", on);
    return;
  }

  element.checked = on;
  element.style.borderColor = "green";

  element.dispatchEvent(new Event("click"));
}
