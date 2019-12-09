import { ThunkAction } from "redux-thunk";
import { ActionsObservable, StateObservable, ofType } from "redux-observable";
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
  TAuthActions,
  AUTH_UPDATE_USER_DATA
} from "./types";
import axios from "axios";
import { setItem, removeItem, multiGet } from "../utility";
import {
  ___LOGIN_ENDPOINT___,
  ___WHOAMI_ENDPOINT___,
  ___LOGOUT_ENDPOINT___,
  ___SIGNUP_ENDPOINT___,
  ___INITUSER_ENDPOINT___,
  ___WS_TEST_ENDPOINT
} from "../endpoints";
//import WS from "../../utils/WebSocket_Deprecated_Deprecated";
import { AutoStart } from "../../utils/constants";
import { commentsClear } from "../comments";
//import { messagingClear } from "../chat_Deprecated/messaging";
//import { chatClear } from "../chat";
//import { mockWHOAMI } from "../../mockData/MockUser";
import NetInfo from "@react-native-community/netinfo";
import { formatUserData } from "../../utils/helper";
import { updateFCMToken } from "../settings";
import { StoreType } from "../root";
import { GeneralOffice, FullUserData } from "../../types/ProfileTypes";
import { RehydrateAction, REHYDRATE } from "redux-persist";
import { switchMap, filter, map } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import { ajax } from "rxjs/ajax";
import { chatConnect, chatReconnect } from "../chat";
import { SETTINGS_STARTUP, SettingsStartUpAction } from "../settings/types";

/**
 * StartUp Process:
 *
 * OLD
 * 1) Settings start
 * 2) WhoAmI -> Set Store
 * 3) UpdateFCM
 * 4) WS init
 * 5) Retrieve chats
 *
 * NEW
 * 1) Settings start
 * Re-Connection
 * ---Primary
 * 2) Re-Connection sending -ToDo
 * 2.1) Retrieve Chats - ToDo
 * 2.2) WS init - ToDo
 * ---Secondary
 * 3) | WhoAmI - Done
 * 3) | UpdateFCM - Done
 */

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

const authUpdateUserData = (userData: FullUserData): TAuthActions => ({
  type: AUTH_UPDATE_USER_DATA,
  payload: {
    userData
  }
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
    //dispatch(chatClear());
    //messagingClear();
    //WS.close();
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
    //WS.init(token, resolve);
    resolve({ token, isActive: true });
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
    //WS.init(token, resolve);
    resolve({ token, isActive: true });
  } else {
    resolve({ token, isActive: false });
    dispatch(authCompleted());
  }
};

const reConnectUpdateUserData = (): ThunkAction<
  void,
  StoreType,
  null,
  Action
> => (dispatch, getState) => {
  const { token } = getState().auth;
  axios.defaults.headers.common["Authorization"] = "Token " + token; // for all requests
  axios
    .get(___WHOAMI_ENDPOINT___)
    .then(res => dispatch(authUpdateUserData(formatUserData(res.data))))
    .catch(err => console.log(err));
  dispatch(updateFCMToken());
  setTimeout(() => {
    dispatch(chatReconnect());
  }, 2000);
};

/**
 * EPICS
 */

type ReConnectUserType = RehydrateAction;

const reConnectUserEpic = (
  action$: ActionsObservable<SettingsStartUpAction>,
  state$: StateObservable<StoreType>
) =>
  action$.pipe(
    ofType(SETTINGS_STARTUP),
    filter(() => !state$.value.auth.token),
    map(reConnectUpdateUserData)
    //switchMap(() => map(reConnectUpdateUserData))
  );

export const authEpics = [reConnectUserEpic];
