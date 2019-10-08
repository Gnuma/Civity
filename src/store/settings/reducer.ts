import { updateObject } from "../utility";
import update from "immutability-helper";
import {
  SETTINGS_START,
  SETTINGS_CHANGE_CONNECTION,
  SETTINGS_SAVE_NAV_STATE,
  SETTINGS_UPDATE_FCM_TOKEN,
  CREATE_TOAST,
  SettingsType,
  TSettingsAction,
  SettingsChangeConnectionAction,
  SettingsSaveNavStateAction,
  SettingsUpdateFCMAction,
  SettingsCreateToastAction
} from "./types";

const initialState: SettingsType = {
  isConnected: false,
  navState: undefined,
  fcmToken: undefined,
  toast: {
    text: "",
    snapshot: 0
  }
};

const settingsChangeConnection = (
  state: SettingsType,
  { payload: { isConnected } }: SettingsChangeConnectionAction
): SettingsType =>
  update(state, {
    isConnected: { $set: isConnected }
  });

const settingsSaveNavState = (
  state: SettingsType,
  { payload: { navState } }: SettingsSaveNavStateAction
): SettingsType =>
  update(state, {
    navState: { $set: navState }
  });

const settingsUpdateFCM = (
  state: SettingsType,
  { payload: { token } }: SettingsUpdateFCMAction
): SettingsType =>
  update(state, {
    fcmToken: { $set: token }
  });

const settingsCreateToast = (
  state: SettingsType,
  { payload: { toast } }: SettingsCreateToastAction
): SettingsType =>
  update(state, {
    toast: {
      text: { $set: toast },
      snapshot: { $apply: snapshot => snapshot + 1 }
    }
  });

const reducer = (
  state = initialState,
  action: TSettingsAction
): SettingsType => {
  switch (action.type) {
    case SETTINGS_START:
      return state;

    case SETTINGS_CHANGE_CONNECTION:
      return settingsChangeConnection(state, action);

    case SETTINGS_SAVE_NAV_STATE:
      return settingsSaveNavState(state, action);

    case SETTINGS_UPDATE_FCM_TOKEN:
      return settingsUpdateFCM(state, action);

    case CREATE_TOAST:
      return settingsCreateToast(state, action);

    default:
      return state;
  }
};

export default reducer;
