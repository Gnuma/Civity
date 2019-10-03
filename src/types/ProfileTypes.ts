export type OfficeIdentifierType = "SP" | "UN";
export type UserType = "Pro" | "Free" | "Business";

export interface OfficeType {
  id: number;
  name: string;
  address: string;
  officeType: OfficeIdentifierType;
  course: CourseType;
}

export interface CourseType {
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
  pk: number;
  isActive: boolean;
  office: OfficeType;
}
