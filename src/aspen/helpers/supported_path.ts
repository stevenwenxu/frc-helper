export enum SupportedPath {
  StudentRegistration0 = "/aspen/studentRegistration0.do",
  StudentRegistration1 = "/aspen/studentRegistration1.do",
  StudentRegistration2 = "/aspen/studentRegistration2.do",
  // Address, Phone
  MultiplePersonAddressChildDetail = "/aspen/multiplePersonAddressChildDetail.do",
  // Add parent
  AddRecord = "/aspen/addRecord.do",
  // Edit parent
  ContactDetail = "/aspen/contactDetail.do",
  // Educational background, FRC tracker, Programs ELL
  ChildDetail = "/aspen/childDetail.do",
  // Demographics
  StudentPersonAddressDetail = "/aspen/studentPersonAddressDetail.do",
  // Transfer student to another school
  StudentTransfer = "/aspen/studentTransfer.do"
}

export const supportedUrls = Object.values(SupportedPath).map((path) => {
  return `https://ocdsb.myontarioedu.ca${path}*`
});

export enum SupportedContext {
  Phone = "person.phone.popup",
  Address = "person.address.popup",
  EducationalBackground = "extracurricular.std.edu.bkgd.list.detail",
  FRCTracker = "extracurricular.std.ell.tracker.list.detail",
  ProgramsELL = "extracurricular.ell.list.detail.ocdsb"
}

export function expectedPersonType(pathname: string) {
  switch (pathname) {
    case SupportedPath.StudentRegistration0:
    case SupportedPath.StudentRegistration1:
    case SupportedPath.StudentRegistration2:
    case SupportedPath.ChildDetail:
    case SupportedPath.StudentPersonAddressDetail:
    case SupportedPath.StudentTransfer:
      return ["student"];
    case SupportedPath.MultiplePersonAddressChildDetail:
      return ["student", "parent"];
    case SupportedPath.AddRecord:
    case SupportedPath.ContactDetail:
      return ["parent"];
    default:
      console.log("Unknown path:", pathname);
      return [];
  }
}

export function supportedPathsForPersonType(personType: ("studentOnly" | "parentOnly" | "both")) {
  switch (personType) {
    case "studentOnly":
      return [
        SupportedPath.StudentRegistration0,
        SupportedPath.StudentRegistration1,
        SupportedPath.StudentRegistration2,
        SupportedPath.ChildDetail,
        SupportedPath.StudentPersonAddressDetail,
        SupportedPath.StudentTransfer,
      ];
    case "parentOnly":
      return [
        SupportedPath.AddRecord,
        SupportedPath.ContactDetail,
      ];
    case "both":
      return [
        SupportedPath.MultiplePersonAddressChildDetail,
      ];
    default:
      console.log("Unknown person type:", personType);
      return [];
  }
}
