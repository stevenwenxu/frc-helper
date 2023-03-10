import { Family } from "./models/family";
import { Parent, Student } from "./models/person";

export class FamilyRepository {
  static async getFamilyWithUniqueId(uniqueId: string) {
    const family = await chrome.storage.local.get([uniqueId]);

    if (Object.keys(family).length > 0) {
      console.log(`family_repository.ts: family with id ${uniqueId} found`, family[uniqueId]);
      return FamilyRepository.familyFromStoredFamily(family[uniqueId]);
    } else {
      console.log(`family_repository.ts: family with id ${uniqueId} not found.`);
      return null;
    }
  }

  static async getFamilies() {
    const families = await chrome.storage.local.get(null);
    const newFamilies: Family[] = [];
    for (const key in families) {
      if (families.hasOwnProperty(key)) {
        const family = families[key];
        newFamilies.push(FamilyRepository.familyFromStoredFamily(family));
      }
    }
    return newFamilies;
  }

  static async saveFamily(family: Family) {
    const familyId = family.uniqueId;
    await chrome.storage.local.set({ [familyId]: family });
    console.log(`family_repository.ts: Successfully saved family ${familyId} to local storage.`);
  }

  static async updateStudent(familyId: string, personIndex: number, updateBlock: (person: Student) => Student) {
    const family = await this.getFamilyWithUniqueId(familyId);
    if (family) {
      family.people[personIndex] = updateBlock(family.people[personIndex] as Student);
      await this.saveFamily(family);
    }
  }

  static clearOldFamilies() {
    this.getFamilies().then((families) => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      console.log("Clearing families older than", threeDaysAgo.toDateString());
      for (const family of families) {
        if (family.visitDate < threeDaysAgo) {
          chrome.storage.local.remove(family.uniqueId, () => {
            console.log(`Removed family with id ${family.uniqueId}`);
          });
        }
      }
    });
  }

  static familyFromStoredFamily(storedFamily: any) {
    const newFamily = new Family();
    newFamily.parents = storedFamily.parents.map((p: any) => Object.assign(new Parent(), p));
    newFamily.students = storedFamily.students.map((s: any) => Object.assign(new Student(), s));
    newFamily.uniqueId = storedFamily.uniqueId;
    newFamily.visitDate = new Date(storedFamily._visitDate);
    return newFamily;
  }
}
