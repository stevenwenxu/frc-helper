export class OptionsRepository {
  static async getDisplayMode() {
    const options = (await chrome.storage.sync.get("options"))["options"];
    return options.displayMode || "tab";
  }

  static async setDisplayMode(displayMode: string) {
    const options = {
      displayMode,
    };
    await chrome.storage.sync.set({ "options": options });
  }
}
