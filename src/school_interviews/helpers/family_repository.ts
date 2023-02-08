import { Family } from "../models/family";

export class FamilyRepository {
  static async getFamilyWithUniqueId(uniqueId: string) {
    const family = await chrome.storage.local.get([uniqueId]);

    if (Object.keys(family).length > 0) {
      console.log(`family_repository.ts: family with id ${uniqueId} found: ${JSON.stringify(family[uniqueId])}`);
      // Class instances are stored as serialized objects, so we need to convert them back to class instances
      return Object.assign(new Family(), family[uniqueId]) as Family;
    } else {
      console.log(`family_repository.ts: family with id ${uniqueId} not found.`);
      return null;
    }
  }

  static async saveFamily(family: Family) {
    const familyId = family.uniqueId;
    await chrome.storage.local.set({ [familyId]: family });
    console.log(`family_repository.ts: Successfully saved family ${familyId} to local storage.`);
  }
}
