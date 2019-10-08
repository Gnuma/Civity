export type OfficeIdentifierType = "SP" | "UN";
export type UserType = "Pro" | "Free" | "Business";

export interface GeneralOffice extends OfficeSerializer {
  course: GeneralCourse;
}

export interface GeneralCourse {
  year: string;
  name: string;
}

export interface OfficeSerializer {
  id: number;
  name: string;
  address: string;
  officeType: OfficeIdentifierType;
}

export interface CourseSerializer extends GeneralCourse {
  office: OfficeSerializer;
}

export interface UserData {
  username: string;
  email: string;
  phone: string;
  xp: number;
  respect: number;
  usertype: UserType;
  adsCreated: number;
  boughtItems: number;
  soldItems: number;
}

export interface FullUserData extends UserData {
  pk: number;
  isActive: boolean;
  office: GeneralOffice;
}

export interface UsernameSerializer {
  username: string;
}

export interface BasicUser {
  _id: number;
  user: UsernameSerializer;
  xp: number;
  respect: number;
  usertype: UserType;
  adsCreated?: number;
}

export interface UserSerializer extends BasicUser {
  course: CourseSerializer;
}

export interface GeneralUser extends BasicUser {
  office: GeneralOffice;
}

export const LEVEL_DATA: { [key: number]: number } = {
  1: 100,
  2: 200,
  3: 400,
  4: 800,
  5: 1600
};

export interface WHOAMIInterface {
  email: string;
  pk: number;
  quipu_user: {
    adsCreated: number;
    boughtItems: number;
    course: CourseSerializer;
    isActive: boolean;
    phone: string;
    respect: number;
    soldItems: number;
    usertype: UserType;
    xp: number;
  };
  username: string;
}
