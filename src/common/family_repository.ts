import { Family } from "./models/family";
import { Parent, Student } from "./models/person";
import { SecondaryMathAssessment } from "./models/secondary_math_assessment";

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
      if (Object.hasOwn(families, key)) {
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

  /**
   * Updates the student with the return value of updateBlock.
   * @param familyId The unique id of the family.
   * @param personIndex The index of the student in the family.
   * @param updateBlock A function that takes a persisted student, mutates the student (possibly async), and returns a Promise that resolves to the updated student. If the updateBlock returns false, the student will not be updated.
   * @returns A Promise that resolves to true if the student was updated, false otherwise.
   */
  static async updateStudent(familyId: string, personIndex: number, updateBlock: (person: Student) => Promise<Student | false>) {
    let studentUpdated = true;
    const family = await this.getFamilyWithUniqueId(familyId);
    if (family) {
      const updateResult = await updateBlock(family.people[personIndex] as Student);
      if (updateResult) {
        family.people[personIndex] = updateResult;
        await this.saveFamily(family);
      } else {
        console.log("family_repository.ts: updateStudent aborted.");
        studentUpdated = false;
      }
    }
    return studentUpdated;
  }

  static clearOldFamilies() {
    this.getFamilies().then((families) => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      console.log("Clearing families older than", tenDaysAgo.toDateString());
      for (const family of families) {
        if (family.visitDate < tenDaysAgo) {
          this.deleteFamily(family.uniqueId);
        }
      }
    });
  }

  static async deleteFamily(familyId: string) {
    await chrome.storage.local.remove(familyId);
    console.log(`Removed family with id ${familyId}`);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  static familyFromStoredFamily(storedFamily: any) {
    const newFamily = new Family();
    newFamily.parents = storedFamily.parents.map((p: any) => Object.assign(new Parent(), p));
    newFamily.students = storedFamily.students.map((s: any) => {
      const studentObj = Object.assign(new Student(), s);
      const secondaryMathAssessment = s["secondaryMathAssessment"];
      if (secondaryMathAssessment) {
        let newObj = new SecondaryMathAssessment("");
        newObj = Object.assign(newObj, secondaryMathAssessment);
        studentObj.secondaryMathAssessment = newObj;
      }
      return studentObj;
    });
    newFamily.uniqueId = storedFamily.uniqueId;
    newFamily.visitDate = new Date(storedFamily._visitDate);
    return newFamily;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
