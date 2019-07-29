import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";

const initialState = {
  token: null,
  office: null,
  userData: null,
  isActive: false,
  id: null,

  error: null,
  loading: false,
  delayedLogin: false
};

export const authAppInit = (state, action) => {
  return updateObject(state, {
    office: action.payload.office
  });
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const loginSuccess = (
  state,
  {
    payload: {
      token,
      userData: { pk, office, isActive, ...restUserData },
      isDelayed
    }
  }
) => {
  return updateObject(state, {
    token,
    userData: restUserData,
    office,
    isActive,
    id: pk,
    error: null,
    delayedLogin: isDelayed
  });
};

const authCompleted = (state, action) => {
  return updateObject(state, {
    loading: false
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.payload.error,
    loading: false
  });
};

const authSetPhone = (state, { payload: { phone } }) =>
  update(state, {
    userData: {
      phone: { $set: phone }
    },
    isActive: { $set: false }
  });

const logoutSuccess = (state, action) => {
  const { office } = state;
  return update(initialState, { $merge: { office } });
};

const authValidateAccount = (state, action) =>
  update(state, {
    isActive: { $set: true }
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_APPINIT:
      return authAppInit(state, action);

    case actionTypes.AUTH_START:
      return authStart(state, action);

    case actionTypes.AUTH_COMPLETED:
      return authCompleted(state, action);

    case actionTypes.LOGIN_SUCCESS:
      return loginSuccess(state, action);

    case actionTypes.AUTH_FAIL:
      return authFail(state, action);

    case actionTypes.LOGOUT_SUCCESS:
      return logoutSuccess(state, action);

    case actionTypes.AUTH_SET_PHONE:
      return authSetPhone(state, action);

    case actionTypes.AUTH_VALIDATE_ACCOUNT:
      return authValidateAccount(state, action);

    default:
      return state;
  }
};

export default reducer;
