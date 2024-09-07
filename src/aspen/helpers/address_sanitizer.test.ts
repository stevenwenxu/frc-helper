import { AddressSanitizer } from "./address_sanitizer";

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
  });

  test("should return address as-is if it does not match any pattern", () => {
    expect(AddressSanitizer.addressToFill("Address Without Hyphen")).toBe("Address Without Hyphen");
  });

  test("should handle empty string input", () => {
    expect(AddressSanitizer.addressToFill("")).toBe("");
  });
});

describe("AddressSanitizer.unitType", () => {
  test("should return 'Apt.' for addresses with 'apt'", () => {
    expect(AddressSanitizer.unitType("Apt 301 - 123 Main St")).toBe("Apt.");
    expect(AddressSanitizer.unitType("apt 22 345 Oak Drive")).toBe("Apt.");
    expect(AddressSanitizer.unitType("APT-5 678 Maple Ave")).toBe("Apt.");
  });

  test("should return 'Unit' for addresses with 'unit'", () => {
    expect(AddressSanitizer.unitType("Unit 45-678 Elm St")).toBe("Unit");
    expect(AddressSanitizer.unitType("UNIT 22 345 Oak Drive")).toBe("Unit");
    expect(AddressSanitizer.unitType("Unit-101 567 Birch Blvd")).toBe("Unit");
  });

  test("should return '' for addresses with no 'apt' or 'unit'", () => {
    expect(AddressSanitizer.unitType("123 Main St")).toBe("");
    expect(AddressSanitizer.unitType("")).toBe("");
  });
});

describe("AddressSanitizer.unitNumber", () => {
  test("should extract unit number when 'apt' or 'unit' is used", () => {
    expect(AddressSanitizer.unitNumber("261 Saint-Dénis St Apt 2")).toBe("2");
    expect(AddressSanitizer.unitNumber("2111 Montreal Rd UNIT 23")).toBe("23");
    expect(AddressSanitizer.unitNumber("1825 Russell Rd Apt B4")).toBe("B4");
    expect(AddressSanitizer.unitNumber("unit 407 - 345 Barber St")).toBe("407");
  });

  test("should extract unit number from format with prefix and hyphen", () => {
    expect(AddressSanitizer.unitNumber("1-1938 Bromley Rd")).toBe("1");
    expect(AddressSanitizer.unitNumber("4 - 521 Lyon Street")).toBe("4");
  });

  test("should return an empty string if no unit number pattern matches", () => {
    expect(AddressSanitizer.unitNumber("123 Main St")).toBe("");
  });

  test("should handle edge cases with different delimiters and spaces", () => {
    expect(AddressSanitizer.unitNumber("Apt   123 - 456 Elm St")).toBe("123");
    expect(AddressSanitizer.unitNumber("Unit 789, 123 Pine Ave")).toBe("789");
    expect(AddressSanitizer.unitNumber("Apt 45-89 Oak St")).toBe("45");
    expect(AddressSanitizer.unitNumber("Unit 4   -    5 101 Birch Blvd")).toBe("4");
  });

  test("should handle empty string input", () => {
    expect(AddressSanitizer.unitNumber("")).toBe("");
  });
});


describe("AddressSanitizer.postalCode", () => {
  test("should extract a standard postal code format", () => {
    expect(AddressSanitizer.postalCode("123 Main St, K1A 0B1")).toBe("K1A 0B1");
  });

  test("should handle postal codes without a space", () => {
    expect(AddressSanitizer.postalCode("123 Main St, K1A0B1")).toBe("K1A0B1");
  });

  test("should handle mixed case for postal code letters", () => {
    expect(AddressSanitizer.postalCode("456 Elm St, A2b 3c4")).toBe("A2b 3c4");
  });

  test ("should handle postal codes with a hyphen", () => {
    expect(AddressSanitizer.postalCode("789 Pine Ave, P9N-4X3")).toBe("P9N4X3");
  });

  test("should return an empty string if no postal code is present", () => {
    expect(AddressSanitizer.postalCode("123 Main St")).toBe("");
  });

  test("should handle addresses with extra characters around postal code", () => {
    expect(AddressSanitizer.postalCode("Apt 101 - 123 Main St, K1A 0B1")).toBe("K1A 0B1");
    expect(AddressSanitizer.postalCode("Address: 789 Pine Ave, P9N4X3")).toBe("P9N4X3");
    expect(AddressSanitizer.postalCode("101 Birch Blvd, [M5A 1A1]")).toBe("M5A 1A1");
  });

  test("should handle empty string input", () => {
    expect(AddressSanitizer.postalCode("")).toBe("");
  });
});
