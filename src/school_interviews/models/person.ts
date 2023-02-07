export class Person {
  name: string | null = null;
  email: string | null = null;
  phone: string | null = null;
  address: string | null = null;
  // immigrationStatus: string | null = null;
  // extraNotes: string | null = null;
}

export class Student extends Person {
  dateOfBirth: string | null = null;
  countryOfBirth: string | null = null;
  studentNotes: string | null = null;
}
