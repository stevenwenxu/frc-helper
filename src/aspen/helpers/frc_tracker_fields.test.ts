import { FRCTrackerFields } from "./frc_tracker_fields";
import { SchoolCategory } from "../../common/models/school_category";
import { LanguageCategory } from "../../common/models/language_category";

describe("FRCTrackerFields", () => {
  describe("schoolCategory", () => {
    test.each([
      // Elementary school (1-9, 26-29)
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 26, 27, 28, 29].map(value => [value, SchoolCategory.Elementary] as const),
      // Kindergarten (10-14, 30-31)
      ...[10, 11, 12, 13, 14, 30, 31].map(value => [value, SchoolCategory.Kindergarten] as const),
      // Secondary school (15-25)
      ...[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(value => [value, SchoolCategory.Secondary] as const),
      // Unknown
      ...[0, 32, 100].map(value => [value, SchoolCategory.Unknown] as const)
    ] as const)("should return correct school category for dropdown value %i", (dropdownValue, expectedResult) => {
      expect(FRCTrackerFields.schoolCategory(dropdownValue)).toBe(expectedResult);
    });
  });

  describe("languageCategory", () => {
    test.each([
      // ESL
      ...[1, 2, 3, 4, 10, 11, 12, 13, 15, 16, 17, 18, 19, 26, 27, 30, 31].map(value => [value, LanguageCategory.ESL] as const),
      // ELD
      ...[5, 6, 7, 8, 20, 21, 22, 23, 24, 28, 29].map(value => [value, LanguageCategory.ELD] as const),
      // Native
      ...[9, 14, 25].map(value => [value, LanguageCategory.Native] as const),
      // Unknown
      ...[0, 32, 100].map(value => [value, LanguageCategory.Unknown] as const)
    ] as const)("should return correct language category for dropdown value %i", (dropdownValue, expectedResult) => {
      expect(FRCTrackerFields.languageCategory(dropdownValue)).toBe(expectedResult);
    });
  });

  describe("secondaryEnglishCourse", () => {
    test.each([
      // Elementary school (1-9)
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => [value, ""] as const),
      // Kindergarten (10-14)
      ...[10, 11, 12, 13, 14].map(value => [value, ""] as const),
      // Secondary school (15-25)
      [15, "ESLAO"], [16, "ESLBO"], [17, "ESLCO"], [18, "ESLDO"], [19, "ESLEO"],
      [20, "ELDAO"], [21, "ELDBO"], [22, "ELDCO"], [23, "ELDDO"], [24, "ELDEO"],
      [25, "ENG2D"],
      // Elementary school (26-29)
      ...[26, 27, 28, 29].map(value => [value, ""] as const),
      // Kindergarten (30-31)
      ...[30, 31].map(value => [value, ""] as const),
      // Invalid values
      ...[0, 32, 100].map(value => [value, ""] as const)
    ] as const)("should return correct course code for dropdown value %i", (dropdownValue, expectedResult) => {
      expect(FRCTrackerFields.secondaryEnglishCourse(dropdownValue)).toBe(expectedResult);
    });
  });

  describe("overallCategory", () => {
    test.each([
      ...[1, 5, 10, 15, 20].map(value => [value, "1"] as const),
      ...[2, 6, 11, 16, 21].map(value => [value, "2"] as const),
      ...[3, 7, 12, 17, 22].map(value => [value, "3"] as const),
      ...[4, 8, 13, 18, 23].map(value => [value, "4"] as const),
      ...[26, 28, 30, 19, 24].map(value => [value, "5"] as const),
      ...[27, 29, 31].map(value => [value, "6"] as const),
      ...[0, 9, 14, 25, 32, 100].map(value => [value, ""] as const)
    ] as const)("should return correct overall category for dropdown value %i", (dropdownValue, expectedResult) => {
      expect(FRCTrackerFields.overallCategory(dropdownValue)).toBe(expectedResult);
    });
  });

  describe("languageSupport", () => {
    test.each([
      // Kindergarten (all return "1")
      ...[10, 11, 12, 13, 14, 30, 31].map(value => [value, "1"] as const),
      // Native speakers (all return "1")
      ...[9, 14, 25].map(value => [value, "1"] as const),
      // ELD (all return "3")
      ...[5, 6, 7, 8, 20, 21, 22, 23, 24, 28, 29].map(value => [value, "3"] as const),
      // ESL Elementary
      ...[1, 2, 3, 4].map(value => [value, "2"] as const), // STEP 1-4
      ...[26, 27].map(value => [value, "1"] as const), // STEP 5-6
      // ESL Secondary
      ...[15, 16, 17, 18, 19].map(value => [value, "2"] as const), // STEP 1-5
      // Unknown or invalid
      ...[0, 32, 100].map(value => [value, ""] as const)
    ] as const)("should return correct language support for dropdown value %i", (dropdownValue, expectedResult) => {
      expect(FRCTrackerFields.languageSupport(dropdownValue)).toBe(expectedResult);
    });
  });
});
