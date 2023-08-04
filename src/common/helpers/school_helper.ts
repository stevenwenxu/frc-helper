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
}
