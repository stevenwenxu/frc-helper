import { AddressSanitizer } from "./address_sanitizer";

describe("sanitized", () => {
  describe("AddressSanitizer.sanitized", () => {
    test("remove commas and periods", () => {
      expect(AddressSanitizer.sanitized("123, Main. St.")).toBe("123 Main St");
    });

    test("remove city names", () => {
      expect(AddressSanitizer.sanitized("123 Main St, Ottawa")).toBe("123 Main St");
      expect(AddressSanitizer.sanitized("456 Maple Ave, Nepean")).toBe("456 Maple Ave");
    });

    test("remove province names", () => {
      expect(AddressSanitizer.sanitized("123 Main St, Ottawa, ON")).toBe("123 Main St");
    });

    test("remove country names", () => {
      expect(AddressSanitizer.sanitized("789 Elm St, Canada")).toBe("789 Elm St");
      expect(AddressSanitizer.sanitized("101 Pine Ave, Ontario, Canada")).toBe("101 Pine Ave");
    });

    test("remove postal codes", () => {
      expect(AddressSanitizer.sanitized("123 Main St, K1A 0B1")).toBe("123 Main St");
      expect(AddressSanitizer.sanitized("456 Maple Ave, K2B4C6")).toBe("456 Maple Ave");
      expect(AddressSanitizer.sanitized("789 Crescent, K3C-4D7")).toBe("789 cres");
    });

    test("remove cardinal directions", () => {
      expect(AddressSanitizer.sanitized("123 Main St North")).toBe("123 Main St");
      expect(AddressSanitizer.sanitized("456 South Road")).toBe("456 rd");
      expect(AddressSanitizer.sanitized("789 East Crescent")).toBe("789 cres");
      expect(AddressSanitizer.sanitized("101 West Drive")).toBe("101 dr");
      expect(AddressSanitizer.sanitized("101 Westworld Drive")).toBe("101 Westworld dr");
      expect(AddressSanitizer.sanitized("101 Worldwest Drive")).toBe("101 Worldwest dr");
    });

    test("replace street types with abbreviations", () => {
      expect(AddressSanitizer.sanitized("123 Crescent")).toBe("123 cres");
      expect(AddressSanitizer.sanitized("456 Street")).toBe("456 st");
      expect(AddressSanitizer.sanitized("789 Avenue")).toBe("789 ave");
      expect(AddressSanitizer.sanitized("101 Road")).toBe("101 rd");
      expect(AddressSanitizer.sanitized("202 Court")).toBe("202 crt");
      expect(AddressSanitizer.sanitized("303 Drive")).toBe("303 dr");
      expect(AddressSanitizer.sanitized("404 Boulevard")).toBe("404 blvd");
      expect(AddressSanitizer.sanitized("505 Parkway")).toBe("505 pkwy");
      expect(AddressSanitizer.sanitized("606 Circle")).toBe("606 cir");
      expect(AddressSanitizer.sanitized("707 Highway")).toBe("707 hwy");
      expect(AddressSanitizer.sanitized("808 Private")).toBe("808 pvt");
      expect(AddressSanitizer.sanitized("909 Terrance")).toBe("909 terr");
    });

    test("handle mixed cases and partial matches", () => {
      expect(AddressSanitizer.sanitized("123 Maple Crescent, Ottawa, ON")).toBe("123 Maple cres");
      expect(AddressSanitizer.sanitized("456 South Drive, K1A 0B1")).toBe("456 dr");
      expect(AddressSanitizer.sanitized("789 Elm St, nepean, canada")).toBe("789 Elm St");
      expect(AddressSanitizer.sanitized("101 Pine Ave, Ontario")).toBe("101 Pine Ave");
      expect(AddressSanitizer.sanitized("101-111 Cooper St, ON, Canada, K2P2E3")).toBe("101-111 Cooper St");
    });

    test("handle empty string input", () => {
      expect(AddressSanitizer.sanitized("")).toBe("");
    });
  });

  describe("AddressSanitizer.addressToFill", () => {
    test("should remove apartment or unit number and hyphen", () => {
      expect(AddressSanitizer.addressToFill("Apt 301 - 123 Main St")).toBe("123 Main St");
      expect(AddressSanitizer.addressToFill("APT 789- 101 Birch Rd")).toBe("101 Birch Rd");
      expect(AddressSanitizer.addressToFill("Unit 45-678 Elm St")).toBe("678 Elm St");
      expect(AddressSanitizer.addressToFill("UNIT 45 -678 Elm St")).toBe("678 Elm St");
      expect(AddressSanitizer.addressToFill("261 Saint-Dénis st Apt 2")).toBe("261 Saint-Dénis st");
      expect(AddressSanitizer.addressToFill("2111 Montreal rd Unit 23")).toBe("2111 Montreal rd");
      expect(AddressSanitizer.addressToFill("1825 Russell Rd Apt B4")).toBe("1825 Russell Rd");
    });

    test("should remove address prefix with hyphen and number", () => {
      expect(AddressSanitizer.addressToFill("123-456 Main St")).toBe("456 Main St");
    });

    test("should handle addresses without apartment or unit numbers or hyphens", () => {
      expect(AddressSanitizer.addressToFill("123 Main St")).toBe("123 Main St");
      expect(AddressSanitizer.addressToFill("456 Elm St")).toBe("456 Elm St");
      expect(AddressSanitizer.addressToFill("789 Pine Ave")).toBe("789 Pine Ave");
      expect(AddressSanitizer.addressToFill("101 Birch Blvd")).toBe("101 Birch Blvd");
    });

    test("should return address as-is if it does not match any pattern", () => {
      expect(AddressSanitizer.addressToFill("Address Without Hyphen")).toBe("Address Without Hyphen");
    });

    test("should handle empty string input", () => {
      expect(AddressSanitizer.addressToFill("")).toBe("");
    });
  });

});
