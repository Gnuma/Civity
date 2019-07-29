import { UserType } from "../utils/constants";

export const mockOffice = {
  id: 46,
  name: "FAKE Office",
  address: "FAKE Address",
  location: {
    latitude: 23.345345,
    longitude: 21.234534
  },
  officeType: "UN",
  course: {
    id: 6,
    name: "FAKE Course",
    year: "FAKE Year"
  }
};

export const mockWHOAMI = {
  user: {
    pk: 150,
    username: "FAKE Username",
    email: "FAKE EMAIL"
  },
  office: mockOffice,
  phone: 33333333333,
  xp: 1000,
  isActive: false,
  respect: 78,
  userType: UserType.FREE,
  adsCreated: 2
};
