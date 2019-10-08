import {
  GeneralOffice,
  UserData,
  FullUserData
} from "../../types/ProfileTypes";

export const AUTH_APPINIT = "AUTH_APPINIT";
export const AUTH_START = "AUTH_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const AUTH_COMPLETED = "AUTH_COMPLETED";
export const AUTH_SET_PHONE = "AUTH_SET_PHONE";
export const AUTH_VALIDATE_ACCOUNT = "AUTH_VALIDATE_ACCOUNT";
export const AUTH_UPDATE_EXPERIENCE = "AUTH_UPDATE_EXPERIENCE";
export const AUTH_UPDATE_RESPECT = "AUTH_UPDATE_RESPECT";

export interface AuthType {
  token?: string;
  office?: GeneralOffice;
  userData: UserData;
  isActive: boolean;
  id?: number;
  error?: unknown;
  loading: boolean;
  delayedLogin: boolean;
}

interface ResolveObject {
  token: string;
  isActive: boolean;
}

export type ResolveLogin = string | ResolveObject;

export interface AuthAppInitAction {
  type: typeof AUTH_APPINIT;
  payload: {
    office: GeneralOffice;
  };
}

export interface AuthStartAction {
  type: typeof AUTH_START;
}

export interface AuthCompletedAction {
  type: typeof AUTH_COMPLETED;
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: {
    token: string;
    userData: FullUserData;
    isDelayed?: boolean;
  };
}

export interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export interface AuthFailAction {
  type: typeof AUTH_FAIL;
  payload: {
    error: unknown;
  };
}

export interface AuthSetPhoneAction {
  type: typeof AUTH_SET_PHONE;
  payload: {
    phone: string;
  };
}

export interface AuthSetUpdatedExperience {
  type: typeof AUTH_UPDATE_EXPERIENCE;
  payload: {
    xp: number;
  };
}

export interface AuthSetUpdatedRespect {
  type: typeof AUTH_UPDATE_RESPECT;
  payload: {
    isPositive: boolean;
    type: string;
  };
}

export interface AuthSetValidatedAccount {
  type: typeof AUTH_VALIDATE_ACCOUNT;
}

export type TAuthActions =
  | AuthAppInitAction
  | AuthStartAction
  | AuthCompletedAction
  | LoginSuccessAction
  | LogoutSuccessAction
  | AuthFailAction
  | AuthSetPhoneAction
  | AuthSetUpdatedExperience
  | AuthSetUpdatedRespect
  | AuthSetValidatedAccount;
