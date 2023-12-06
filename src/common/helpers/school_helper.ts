export class SchoolHelper {
  static fullSchoolName(shortName: string) {
    return shortName
      .replace("E.S.", "Elementary School")
      .replace("M.S.", "Middle School")
      .replace("H.S.", "High School")
      .replace("S.S.", "Secondary School")
      .replace("I.S.", "Intermediate School")
      .replace("P.S.", "Public School")
      .replace("C.I.", "Collegiate Institute")
  }

  static aspenNameToLaserfischeName(aspenName: string) {
    switch (aspenName) {
      case "Charles H. Hulse P.S.": return "Charles H Hulse Public School";
      case "Carleton Heights P.S.": return "Carleton Heights Elementary School";
      case "Fisher Park P.S./Summit A.S.": return "Fisher Park Public School";
      case "Regina Street A.S.": return "Regina Street Alternative";
      case "Cambridge Street Community P.S.": return "Cambridge Street Public School";
      default: return this.fullSchoolName(aspenName);
    }
  }
}
