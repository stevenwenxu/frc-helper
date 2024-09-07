import { FRCTrackerFields } from "./frc_tracker_fields";
import { SchoolCategory } from "../../common/models/school_category";
import { LanguageCategory } from "../../common/models/language_category";

describe("FRCTrackerFields", () => {
  describe("schoolCategory", () => {
    test("should return SchoolCategory.Elementary for dropdown values 1-9", () => {
      for (let i = 1; i <= 9; i++) {
        expect(FRCTrackerFields.schoolCategory(i)).toBe(SchoolCategory.Elementary);
      }
    });

    test("should return SchoolCategory.Kindergarten for dropdown values 10-14", () => {
      for (let i = 10; i <= 14; i++) {
        expect(FRCTrackerFields.schoolCategory(i)).toBe(SchoolCategory.Kindergarten);
      }
    });

    test("should return SchoolCategory.Secondary for dropdown values 15-25", () => {
      for (let i = 15; i <= 25; i++) {
        expect(FRCTrackerFields.schoolCategory(i)).toBe(SchoolCategory.Secondary);
      }
    });

    test("should return SchoolCategory.Elementary for dropdown values 26-29", () => {
      for (let i = 26; i <= 29; i++) {
        expect(FRCTrackerFields.schoolCategory(i)).toBe(SchoolCategory.Elementary);
      }
    });

    test("should return SchoolCategory.Kindergarten for dropdown values 30-31", () => {
      for (let i = 30; i <= 31; i++) {
        expect(FRCTrackerFields.schoolCategory(i)).toBe(SchoolCategory.Kindergarten);
      }
    });

    test("should return SchoolCategory.Unknown for dropdown values outside the defined ranges", () => {
      const invalidValues = [-1, 0, 32, 50, 100];
      invalidValues.forEach(value => {
        expect(FRCTrackerFields.schoolCategory(value)).toBe(SchoolCategory.Unknown);
      });
    });
  });

  describe("languageCategory", () => {
    test("should return LanguageCategory.ESL for dropdown values in defined ESL ranges", () => {
      const eslValues = [
        1, 2, 3, 4,
        10, 11, 12, 13,
        15, 16, 17, 18, 19,
        26, 27,
        30, 31
      ];
      eslValues.forEach(value => {
        expect(FRCTrackerFields.languageCategory(value)).toBe(LanguageCategory.ESL);
      });
    });

    test("should return LanguageCategory.ELD for dropdown values in defined ELD ranges", () => {
      const eldValues = [
        5, 6, 7, 8,
        20, 21, 22, 23, 24,
        28, 29
      ];
      eldValues.forEach(value => {
        expect(FRCTrackerFields.languageCategory(value)).toBe(LanguageCategory.ELD);
      });
    });

    test("should return LanguageCategory.Native for dropdown values 9, 14, and 25", () => {
      const nativeValues = [9, 14, 25];
      nativeValues.forEach(value => {
        expect(FRCTrackerFields.languageCategory(value)).toBe(LanguageCategory.Native);
      });
    });

    test("should return LanguageCategory.Unknown for dropdown values outside the defined ranges", () => {
      const unknownValues = [-1, 0, 32, 50, 100];
      unknownValues.forEach(value => {
        expect(FRCTrackerFields.languageCategory(value)).toBe(LanguageCategory.Unknown);
      });
    });
  });

  describe("overallCategory", () => {
    test("should return '1' for dropdown values 1, 5, 10, 15, 20", () => {
      const values = [1, 5, 10, 15, 20];
      values.forEach(value => {
        expect(FRCTrackerFields.overallCategory(value)).toBe("1");
      });
    });

    test("should return '2' for dropdown values 2, 6, 11, 16, 21", () => {
      const values = [2, 6, 11, 16, 21];
      values.forEach(value => {
        expect(FRCTrackerFields.overallCategory(value)).toBe("2");
      });
    });

    test("should return '3' for dropdown values 3, 7, 12, 17, 22", () => {
      const values = [3, 7, 12, 17, 22];
      values.forEach(value => {
        expect(FRCTrackerFields.overallCategory(value)).toBe("3");
      });
    });

    test("should return '4' for dropdown values 4, 8, 13, 18, 23", () => {
      const values = [4, 8, 13, 18, 23];
      values.forEach(value => {
        expect(FRCTrackerFields.overallCategory(value)).toBe("4");
      });
    });

    test("should return '5' for dropdown values 26, 28, 30, 19, 24", () => {
      const values = [26, 28, 30, 19, 24];
      values.forEach(value => {
        expect(FRCTrackerFields.overallCategory(value)).toBe("5");
      });
    });

    test("should return '6' for dropdown values 27, 29, 31", () => {
      const values = [27, 29, 31];
      values.forEach(value => {
        expect(FRCTrackerFields.overallCategory(value)).toBe("6");
      });
    });

    test("should return an empty string for dropdown values not covered by cases", () => {
      const unknownValues = [-1, 0, 32, 50, 100];
      unknownValues.forEach(value => {
        expect(FRCTrackerFields.overallCategory(value)).toBe("");
      });
    });
  });

});
