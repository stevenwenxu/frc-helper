import { OptionsRepository } from "./common/options_repository";

async function save() {
  const displayModeElement = document.getElementById("displayMode")! as HTMLSelectElement;

  await OptionsRepository.setDisplayMode(displayModeElement.value);

  const status = document.getElementById("status")!;
  status.textContent = "Options saved.";
  setTimeout(() => {
    status.textContent = "";
  }, 2000);
}

async function restoreOptions() {
  const displayModeElement = document.getElementById("displayMode")! as HTMLSelectElement;
  displayModeElement.value = await OptionsRepository.getDisplayMode();
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save")!.addEventListener("click", save);
