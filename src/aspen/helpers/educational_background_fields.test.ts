import { EducationalBackgroundFields } from "./educational_background_fields";
import { Student } from "../../common/models/person";

describe("EducationalBackgroundFields", () => {
  describe("schoolYear", () => {
    test("should return the correct school year format for months Jan-Nov", () => {
      // Mock the Date object to return a fixed date in a month from Jan to Nov
      const fixedDate = new Date(2023, 5); // June 2023
      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

      expect(EducationalBackgroundFields.schoolYear()).toBe("2022-2023");
    });

    test("should return the correct school year format for December", () => {
      // Mock the Date object to return a fixed date in December
      const fixedDate = new Date(2023, 11); // December 2023
      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

      expect(EducationalBackgroundFields.schoolYear()).toBe("2023-2024");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe("comments", () => {
    const student = { firstName: "John" } as Student;

    test("should generate the correct comment for finished grade with number", () => {
      expect(EducationalBackgroundFields.comments(student, "5", true, "Canada", "2022-2023"))
        .toBe("According to the family, John finished grade 5 in Canada in the school year 2022-2023. The teaching language was English. Please see the report cards in your school's Laserfiche repository. / No official school document was provided to FRC.");
    });

    test("should generate the correct comment for registered in grade with number", () => {
      expect(EducationalBackgroundFields.comments(student, "8", false, "USA", "2021-2022"))
        .toBe("According to the family, John registered in grade 8 in USA in the school year 2021-2022. The teaching language was English. Please see the report cards in your school's Laserfiche repository. / No official school document was provided to FRC.");
    });

    test("should generate the correct comment for finished grade with non-numeric grade", () => {
      expect(EducationalBackgroundFields.comments(student, "JK", true, "UK", "2020-2021"))
        .toBe("According to the family, John finished JK in UK in the school year 2020-2021. The teaching language was English. Please see the report cards in your school's Laserfiche repository. / No official school document was provided to FRC.");
    });

    test("should generate the correct comment for registered in grade with non-numeric grade", () => {
      expect(EducationalBackgroundFields.comments(student, "SK", false, "Australia", "2019-2020"))
        .toBe("According to the family, John registered in SK in Australia in the school year 2019-2020. The teaching language was English. Please see the report cards in your school's Laserfiche repository. / No official school document was provided to FRC.");
    });
  });
});
