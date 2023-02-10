import { Family } from "../models/family";
import { Parent, Student } from "../models/person";

export class FamilyRepository {
  static async getFamilyWithUniqueId(uniqueId: string) {
    const family = await chrome.storage.local.get([uniqueId]);

    if (Object.keys(family).length > 0) {
      console.log(`family_repository.ts: family with id ${uniqueId} found`, family[uniqueId]);
      const newFamily = new Family();
      newFamily.parents = family[uniqueId].parents.map((p: any) => Object.assign(new Parent(), p));
      newFamily.students = family[uniqueId].students.map((s: any) => Object.assign(new Student(), s));
      newFamily.uniqueId = family[uniqueId].uniqueId;
      return newFamily;
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
