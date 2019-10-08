import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import {
  AUTH_APPINIT,
  AUTH_START,
  LOGIN_SUCCESS,
  AUTH_FAIL,
  LOGOUT_SUCCESS,
  AUTH_COMPLETED,
  AUTH_SET_PHONE,
  AUTH_VALIDATE_ACCOUNT,
  AUTH_UPDATE_EXPERIENCE,
  AUTH_UPDATE_RESPECT,
  ResolveLogin,
  TAuthActions
} from "./types";
import axios from "axios";
import { setItem, removeItem, multiGet } from "../utility";
import {
  ___LOGIN_ENDPOINT___,
  ___WHOAMI_ENDPOINT___,
  ___LOGOUT_ENDPOINT___,
  ___SIGNUP_ENDPOINT___,
  ___INITUSER_ENDPOINT___
} from "../endpoints";
import WS from "../../utils/WebSocket";
import { AutoStart } from "../../utils/constants";
import { commentsClear } from "./comments";
import { messagingClear } from "./messaging";
import { chatClear } from "./chat";
import { mockWHOAMI } from "../../mockData/MockUser";
import NetInfo from "@react-native-community/netinfo";
import { formatUserData } from "../../utils/helper";
import { updateFCMToken } from "./settings";
import { StoreType } from "../root";
import { GeneralOffice, FullUserData } from "../../types/ProfileTypes";
import { any } from "prop-types";

const CookieManager = require("react-native-cookies");

const tokenKey = "@auth:token";
const officeKey = "@auth:office";
const userDataKey = "@auth:userData";

export const authAppInit = (
  office: GeneralOffice,
  isSaving: boolean
): TAuthActions => {
  if (isSaving) setItem(officeKey, office);
  return {
    type: AUTH_APPINIT,
    payload: {
      office
    }
  };
};

export const authStart = (): TAuthActions => {
  return {
    type: AUTH_START
  };
};

export const authCompleted = (): TAuthActions => {
  return {
    type: AUTH_COMPLETED
  };
};

export const loginSuccess = (
  token: string,
  userData: FullUserData,
  isDelayed?: boolean
): TAuthActions => {
  axios.defaults.headers.common["Authorization"] = "Token " + token; // for all requests
  setItem(tokenKey, token);
  setItem(userDataKey, userData);
  setItem(officeKey, userData.office);
  return {
    type: LOGIN_SUCCESS,
    payload: {
      token,
      userData,
      isDelayed
    }
  };
};

export const logoutSuccess = (): TAuthActions => {
  removeItem(tokenKey);
  removeItem(userDataKey);
  axios.defaults.headers.common["Authorization"] = undefined; // for all requests
  return {
    type: LOGOUT_SUCCESS
  };
};

export const authFail = (error: Object): TAuthActions => {
  return {
    type: AUTH_FAIL,
    payload: {
      error: error
    }
  };
};

export const authSetPhone = (phone: string): TAuthActions => ({
  type: AUTH_SET_PHONE,
  payload: {
    phone
  }
});

const authSetUpdatedExperience = (xp: number): TAuthActions => ({
  type: AUTH_UPDATE_EXPERIENCE,
  payload: {
    xp
  }
});

const authSetUpdatedRespect = (
  isPositive: boolean,
  type: string
): TAuthActions => ({
  type: AUTH_UPDATE_RESPECT,
  payload: {
    isPositive,
    type
  }
});

const authSetValidatedAccount = (): TAuthActions => ({
  type: AUTH_VALIDATE_ACCOUNT
});

//Action Creators

export const authUpdateExperience = (
  xp: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) =>
  getState().auth.userData && dispatch(authSetUpdatedExperience(xp));

export const authUpdateRespect = (
  isPositive: boolean,
  type: string
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) =>
  getState().auth.userData && dispatch(authSetUpdatedRespect(isPositive, type));

export const authLogin = (
  username: string,
  password: string
): ThunkAction<void, StoreType, null, Action> => {
  return (dispatch, getState): Promise<ResolveLogin> => {
    return new Promise<ResolveLogin>((resolve, reject) => {
      dispatch(authStart());
      axios
        .post(___LOGIN_ENDPOINT___, {
          username,
          password
        })
        .then(res => {
          const token = res.data.key;
          login({ dispatch, token, resolve, reject });
        })
        .catch(err => {
          console.log(err);
          dispatch(authFail(err));
          reject(err);
        });
    });
  };
};

export const autoLogin = (): ThunkAction<void, StoreType, null, Action> => {
  return (dispatch, getState): Promise<ResolveLogin> => {
    return new Promise<ResolveLogin>((resolve, reject) => {
      //return reject(AutoStart.firstTime); //Testing
      if (getState().auth.token) return resolve(AutoStart.logged);
      dispatch(authStart());
      multiGet([tokenKey, officeKey, userDataKey])
        .then(async (userInfos: any) => {
          if (userInfos === undefined) return reject(AutoStart.anonymous);
          const token = userInfos[0][1];
          const office = userInfos[1][1];
          const userData = userInfos[2][1];

          if (token !== null) {
            if (await NetInfo.isConnected.fetch()) {
              login({
                dispatch,
                resolve,
                token,
                reject: () => reject(AutoStart.anonymous)
              });
            } else {
              if (userData) {
                dispatch(loginSuccess(token, userData, true));
                resolve(AutoStart.logged);
              } else {
                dispatch(authFail("No User data saved in async store"));
                reject(AutoStart.anonymous);
              }
            }
          } else {
            dispatch(authFail("Token not found"));
            if (office !== null) {
              //Office Set but no login
              dispatch(authAppInit(office, false));
              reject(AutoStart.anonymous);
            } else {
              //No Login And no Office: First time start
              dispatch(authFail("Office not set"));
              reject(AutoStart.firstTime);
            }
          }
        })
        .catch(err => {
          console.log("Error in storage: ", err);
          dispatch(authFail(err));
          reject(AutoStart.firstTime);
        });
    });
  };
};

export const authLogout = (): ThunkAction<void, StoreType, null, Action> => {
  return dispatch => {
    //dispatch(authStart());
    axios
      .post(___LOGOUT_ENDPOINT___)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        dispatch(authFail(err));
      });

    dispatch(commentsClear());
    dispatch(chatClear());
    messagingClear();
    WS.close();
    dispatch(logoutSuccess());
  };
};

export const authSignup = (
  username: string,
  email: string,
  password1: string,
  password2: string,
  phone: string
): ThunkAction<void, StoreType, null, Action> => {
  return (dispatch, getState): Promise<ResolveLogin> => {
    return new Promise<ResolveLogin>((resolve, reject) => {
      const officeData = getState().auth.office;
      if (!officeData) throw "Office has not beign set";
      const office = officeData.id;
      const course = officeData.course.name;
      const year = officeData.course.year;
      dispatch(authStart());
      axios
        .post(___SIGNUP_ENDPOINT___, {
          username: username,
          email: email,
          password1: password1,
          password2: password2,
          office: office,
          course: course,
          year: year,
          phone: phone
        })
        .then(res => {
          login({ dispatch, resolve, reject, token: res.data.key });
        })
        .catch(err => {
          console.log({ err });
          dispatch(authFail(err));
          reject(err);
        });
    });
  };
};

export const authValidateAccount = (): ThunkAction<
  void,
  StoreType,
  null,
  Action
> => (dispatch, getState) =>
  new Promise<ResolveLogin>(resolve => {
    const token = getState().auth.token;
    dispatch(authSetValidatedAccount());
    WS.init(token, resolve);
  });

export const authDelayedLogin = (): ThunkAction<
  void,
  StoreType,
  null,
  Action
> => (dispatch, getState) =>
  new Promise<ResolveLogin>((resolve, reject) => {
    if (getState().auth.delayedLogin) {
      const token = getState().auth.token;
      if (!token) throw "Token is not set";
      login({ dispatch, resolve, reject, token });
    } else {
      reject("No Delayed Login");
    }
  });

interface LoginType {
  dispatch: (value?: Action) => void;
  resolve: (value?: ResolveLogin | PromiseLike<ResolveLogin>) => void;
  reject: (value?: string) => void;
  token: string;
}

const login = async ({ dispatch, resolve, reject, token }: LoginType) => {
  await CookieManager.clearAll();

  console.log("Logging in...", token);
  if (!token) {
    console.log("ERROR NOT SET IN LOGIN");
    throw "Error not set in login";
  }
  let userData;

  try {
    const response = await axios.get(___WHOAMI_ENDPOINT___, {
      headers: {
        Authorization: "Token " + token
      }
    });
    userData = formatUserData(response.data);
    console.log(userData);
  } catch (error) {
    console.log("Error -> ", error);
    dispatch(authFail(error));
    return reject(error);
  }

  //userData = mockWHOAMI; //TEST
  dispatch(loginSuccess(token, userData));
  dispatch(updateFCMToken());
  console.log(userData.isActive);
  if (userData.isActive) {
    WS.init(token, resolve);
  } else {
    resolve({ token, isActive: false });
    dispatch(authCompleted());
  }
};
