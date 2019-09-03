import colors from "../styles/colors";
import { StatusBar, Platform } from "react-native";
import Device from "react-native-device-info";

export const IS_ANDROID = Platform.OS === "android";

export const ___BOOK_IMG_RATIO___ = 4 / 3;

export const CODE_LENGTH = 6;

export const ChatType = {
  sales: "sales",
  shopping: "shopping"
};
export const AutoStart = {
  logged: "logged",
  anonymous: "anonymous",
  firstTime: "firstTime",
  busy: "busy"
};

export const LEVEL_DATA = {
  1: 100,
  2: 200,
  3: 400,
  4: 800,
  5: 1600
};

export const CONDITIONS_DATA = {
  0: {
    text: "Ottimo",
    percentage: 359.99,
    color: colors.secondary
  },
  1: {
    text: "Buono",
    percentage: 225,
    color: colors.lightYellow
  },
  2: {
    text: "Usurato",
    percentage: 135,
    color: colors.red
  },
  3: {
    text: "ERROR",
    percentage: 45,
    color: colors.red
  }
};

export const ChatStatus = {
  LOCAL: 0,
  PENDING: 1,
  PROGRESS: 2,
  EXCHANGE: 3,
  FEEDBACK: 4,
  COMPLETED: 5,
  REJECTED: 6,
  BLOCKED: 7
};

export const OfficeTypes = {
  UNIVERSITY: "UN",
  SCHOOL: "SP"
};

export const SellType = {
  NEW: "NEW",
  MODIFY: "MODIFY"
};

export const OffertStatus = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2
};

export const OffertType = {
  INVALID: "INVALID",

  CREATE: "CREATE",
  EDIT: "EDIT",
  DECIDE: "DECIDE",
  ACCEPTED: "ACCEPTED",
  COMPLETE_EXCHANGE: "COMPLETE_EXCHANGE",
  WAIT_EXCHANGE: "WAIT_EXCHANGE",
  SEND_FEEDBACK: "SEND_FEEDBACK",
  COMPLETED: "COMPLETED",
  BLOCKED: "BLOCKED"
};

export const UserType = {
  FREE: "FREE",
  PRO: "PRO",
  BUSINESS: "BUSINESS"
};

export const AUTH_ERROR = {
  SEMIAUTH: "SEMIAUTH"
};

export const NOTCH_MARGIN =
  Platform.OS === "android" && Device.hasNotch() ? StatusBar.currentHeight : 0;

export const STATUS_BAR_MARGIN =
  Platform.OS === "android" && !Device.hasNotch() ? StatusBar.currentHeight : 0;

export const TextOffertStatus = {
  0: "Da gestire",
  1: "Accettata",
  2: "Rifiutata"
};

export const FEEDBACK_TYPES = {
  POSITIVE: 1,
  NEGATIVE: 0
};

export const TextFeedbackTypes = {
  1: "Positivo",
  0: "Negativo"
};

const bottomInsetDevices = {
  "iPhone10,6": true,
  "iPhone11,2": true,
  "iPhone11,4": true,
  "iPhone11,6": true,
  "iPhone11,8": true
};

export const BOTTOM_INSET = bottomInsetDevices[Device.getDeviceId()] ? 34 : 0;

export const KAV_BEHAVIOR = IS_ANDROID ? "" : "padding";

export const IT_MONTHS = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre"
];

export const MAX_ADS_FREE_ACCOUNT = 5;
