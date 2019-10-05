import {
  AuthType,
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
  TAuthActions,
  AuthAppInitAction,
  AuthStartAction,
  LoginSuccessAction,
  AuthCompletedAction,
  AuthFailAction,
  AuthSetPhoneAction,
  LogoutSuccessAction,
  AuthSetUpdatedRespect,
  AuthSetValidatedAccount,
  AuthSetUpdatedExperience
} from "./types";
import { updateObject } from "../utility";
import update from "immutability-helper";

const initialState: AuthType = {
  token: undefined,
  office: undefined,
  userData: undefined,
  isActive: false,
  id: undefined,
  error: undefined,
  loading: false,
  delayedLogin: false
};

const authAppInit = (state: AuthType, action: AuthAppInitAction): AuthType => {
  const office = action.payload.office;
  return updateObject(state, {
    office
  });
};

const authStart = (state: AuthType, action: AuthStartAction) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const loginSuccess = (
  state: AuthType,
  {
    payload: {
      token,
      userData: { pk, office, isActive, ...restUserData },
      isDelayed
    }
  }: LoginSuccessAction
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

const authCompleted = (state: AuthType, action: AuthCompletedAction) => {
  return updateObject(state, {
    loading: false
  });
};

const authFail = (state: AuthType, action: AuthFailAction) => {
  return updateObject(state, {
    error: action.payload.error,
    loading: false
  });
};

const authSetPhone = (
  state: AuthType,
  { payload: { phone } }: AuthSetPhoneAction
) =>
  update(state, {
    userData: {
      phone: { $set: phone }
    },
    isActive: { $set: false }
  });

const logoutSuccess = (state: AuthType, action: LogoutSuccessAction) => {
  const { office } = state;
  return update(initialState, { $merge: { office } });
};

const authValidateAccount = (
  state: AuthType,
  action: AuthSetValidatedAccount
) =>
  update(state, {
    isActive: { $set: true }
  });

const authUpdateExperience = (
  state: AuthType,
  { payload: { xp } }: AuthSetUpdatedExperience
) =>
  update(state, {
    userData: {
      xp: { $apply: oldXP => oldXP + xp }
    }
  });

const authUpdateRespect = (
  state: AuthType,
  { payload: { isPositive, type } }: AuthSetUpdatedRespect
) => {
  if (!state.userData) return state;
  const total = state.userData.soldItems + state.userData.boughtItems;
  return update(state, {
    userData: {
      respect: {
        $apply: oldRespect => {
          let positives = (total * oldRespect) / 100;
          positives = positives + (isPositive ? 1 : -1);
          return ((total + 1) / positives) * 100;
        }
      },
      soldItems: {
        $apply: soldItems =>
          type == ChatType.sales ? soldItems + 1 : soldItems
      },
      boughtItems: {
        $apply: boughtItems =>
          type == ChatType.shopping ? boughtItems + 1 : boughtItems
      }
    }
  });
};

const reducer = (state = initialState, action: TAuthActions): AuthType => {
  switch (action.type) {
    case AUTH_APPINIT:
      return authAppInit(state, action);

    case AUTH_START:
      return authStart(state, action);

    case AUTH_COMPLETED:
      return authCompleted(state, action);

    case LOGIN_SUCCESS:
      return loginSuccess(state, action);

    case AUTH_FAIL:
      return authFail(state, action);

    case LOGOUT_SUCCESS:
      return logoutSuccess(state, action);

    case AUTH_SET_PHONE:
      return authSetPhone(state, action);

    case AUTH_VALIDATE_ACCOUNT:
      return authValidateAccount(state, action);

    case AUTH_UPDATE_EXPERIENCE:
      return authUpdateExperience(state, action);

    case AUTH_UPDATE_RESPECT:
      return authUpdateRespect(state, action);

    default:
      return state;
  }
};

export default reducer;
