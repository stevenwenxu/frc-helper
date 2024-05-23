export class AddressSanitizer {
  static sanitized(address: string) {
    return address
      .replace(/,|\./g, "")
      .replace(/ottawa|nepean|kanata|stittsville|manotick|barrhaven|orleans|ontario|canada/gi, "")
      .replace(/ ON /i, "")
      .replace(/[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d/i, "")
      .replace(/\bnorth\b|\bsouth\b|\beast\b|\bwest\b/i, "")
      .replace(/crescent/i, "cres")
      .replace(/street/i, "st")
      .replace(/avenue/i, "ave")
      .replace(/road/i, "rd")
      .replace(/court/i, "crt")
      .replace(/drive/i, "dr")
      .replace(/boulevard/i, "blvd")
      .replace(/parkway/i, "pkwy")
      .replace(/circle/i, "cir")
      .replace(/highway/i, "hwy")
      .replace(/private/i, "pvt")
      .replace(/terrance/i, "terr");
  }

  static addressToFill(address: string) {
    if (/\bapt\b|\bunit\b/i.test(address)) {
      return address.replace(/(apt|unit) *(\w+) *-?/i, "");
    } else if (/\w+ *- *\d+/.test(address)) {
      return address.replace(/\w+ *-/, "");
    }

    return address;
  }

  static unitType(address: string) {
    const typeMatch = address.match(/(\bapt\b|\bunit\b)/i);

    if (typeMatch) {
      return typeMatch[1].toLowerCase() === "apt" ? "Apt." : "Unit";
    }

    return "";
  }

  static unitNumber(address: string) {
    /*
      261 Saint-Dénis st Apt 2
      2111 Montreal rd Unit 23
      1825 Russell Rd Apt B4
      unit 407 - 345 barber St
    */
    const numberMatch1 = address.match(/(?:apt|unit) *(\w+) *-?/i);
    /*
      1-1938 Bromley rd
      4 - 521 Lyon Street
    */
    const numberMatch2 = address.match(/(\w+) *- *\d+/);

    return numberMatch1?.[1] || numberMatch2?.[1] || "";
  }

  static postalCode(address: string) {
    return address.match(/[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d/i)?.[0] || "";
  }
}
