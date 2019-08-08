import * as actionTypes from "./actionTypes";
import axios from "axios";
import NavigatorService from "../../navigator/NavigationService";
import { setItem, removeItem, multiGet } from "../utility";
import {
  ___LOGIN_ENDPOINT___,
  ___WHOAMI_ENDPOINT___,
  ___LOGOUT_ENDPOINT___,
  ___SIGNUP_ENDPOINT___,
  ___INITUSER_ENDPOINT___
} from "../constants";
import { notificationsUnsubscribe } from "./notifications";
import WS from "../../utils/WebSocket";
import { AutoStart } from "../../utils/constants";
import CookieManager from "react-native-cookies";
import { commentsClear } from "./comments";
import { messagingClear } from "../actions/messaging";
import { chatClear } from "./chat";
import { mockWHOAMI } from "../../mockData/MockUser";
import NetInfo from "@react-native-community/netinfo";
import { formatUserData } from "../../utils/helper";
import { updateFCMToken } from "./settings";

const isOffline = false;

const tokenKey = "@auth:token";
const officeKey = "@auth:office";
const userDataKey = "@auth:userData";

export const authAppInit = (office, isSaving) => {
  if (isSaving) setItem(officeKey, office);
  return {
    type: actionTypes.AUTH_APPINIT,
    payload: {
      office
    }
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authCompleted = () => {
  return {
    type: actionTypes.AUTH_COMPLETED
  };
};

export const loginSuccess = (token, userData, isDelayed) => {
  axios.defaults.headers.common["Authorization"] = "Token " + token; // for all requests
  setItem(tokenKey, token);
  setItem(userDataKey, userData);
  setItem(officeKey, userData.office);
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: {
      token,
      userData,
      isDelayed
    }
  };
};

export const logoutSuccess = () => {
  removeItem(tokenKey);
  removeItem(userDataKey);
  axios.defaults.headers.common["Authorization"] = undefined; // for all requests
  return {
    type: actionTypes.LOGOUT_SUCCESS
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    payload: {
      error: error
    }
  };
};

export const authSetPhone = phone => ({
  type: actionTypes.AUTH_SET_PHONE,
  payload: {
    phone
  }
});

//Action Creators

export const authUpdateExperience = xp => (dispatch, getState) =>
  getState().auth.userData &&
  dispatch({
    type: actionTypes.AUTH_UPDATE_EXPERIENCE,
    payload: {
      xp
    }
  });

export const authUpdateRespect = (isPositive, type) => (dispatch, getState) =>
  getState().auth.userData &&
  dispatch({
    type: actionTypes.AUTH_UPDATE_RESPECT,
    payload: {
      isPositive,
      type
    }
  });

export const authLogin = (username, password) => {
  return (dispatch, getState) => {
    return new Promise(function(resolve, reject) {
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

export const autoLogin = () => {
  return (dispatch, getState) => {
    return new Promise(function(resolve, reject) {
      //return reject(AutoStart.firstTime); //Testing
      if (getState().auth.token) return resolve(AutoStart.logged);
      dispatch(authStart());
      multiGet([tokenKey, officeKey, userDataKey])
        .then(async userInfos => {
          //console.log(userInfos);
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
              console.log("Offline login");
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

export const authLogout = () => {
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

export const authSignup = (username, email, password1, password2, phone) => {
  return (dispatch, getState) => {
    return new Promise(function(resolve, reject) {
      const officeData = getState().auth.office;
      const office = officeData.id;
      const course = officeData.course.name;
      const year = officeData.course.year;
      dispatch(authStart());
      if (isOffline) {
        console.log(username, email, password1, password2);
      } else {
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
      }
    });
  };
};

export const authValidateAccount = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const token = getState().auth.token;
    dispatch({ type: actionTypes.AUTH_VALIDATE_ACCOUNT });
    WS.init(token, resolve);
  });

export const authDelayedLogin = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    if (getState().auth.delayedLogin) {
      login({ dispatch, resolve, reject, token: getState().auth.token });
    } else {
      reject("No Delayed Login");
    }
  });

const login = async ({ dispatch, resolve, reject, token }) => {
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
