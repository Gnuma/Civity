export type OfficeType = "SP" | "UN";
export type UserType = "Pro" | "Free" | "Business";

export interface Office {
  id: number;
  name: string;
  address: string;
  officeType: OfficeType;
  course: Course;
}

export interface Course {
  year: string;
  name: string;
}

export interface UserData {
  username: string;
  email: string;
  phone: string;
  xp: number;
  respect: number;
  adsCreated: number;
  boughtItems: number;
  soldItems: number;
}

export interface FullUserData extends UserData {
  office: Office;
}
