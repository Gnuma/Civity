import store from "../store/store";
import NavigationService from "../navigator/NavigationService";
import { StackActions, NavigationActions } from "react-navigation";
import { AUTH_ERROR } from "./constants";

export default (options = {}) => {
  const { token, isActive } = store.getState().auth;
  return new Promise(function(resolve, reject) {
    const rejectFunction = options.SEMIAUTH
      ? err => semiAuth(err, reject, resolve)
      : reject;

    if (token && (isActive || options.SEMIAUTH)) {
      resolve(token);
    } else {
      if (!token) {
        NavigationService.navigate("AUTH", { resolve, reject: rejectFunction });
      } else {
        NavigationService.navigate("PhoneValidation", {
          resolve,
          reject: rejectFunction
        });
      }
    }
  });
};

/**
 * OPTIONS
 *
 * SEMIAUTH: Bool
 */

const semiAuth = (err, reject, resolve) => {
  if (err === AUTH_ERROR.SEMIAUTH) {
    resolve();
  } else {
    reject();
  }
};
