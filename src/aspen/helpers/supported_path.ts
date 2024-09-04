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
  ProgramsELL = "extracurricular.ell.list.detail"
}
