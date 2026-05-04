interface Options {
  displayMode?: string;
}

export class OptionsRepository {
  static async getDisplayMode() {
    const storage = await chrome.storage.sync.get("options");
    const options = storage.options as Options | undefined;
    return options?.displayMode || "tab";
  }

  static async setDisplayMode(displayMode: string) {
    const options = {
      displayMode,
    };
    await chrome.storage.sync.set({ "options": options });
  }
}
