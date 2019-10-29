export const SETTINGS_STARTUP = "SETTINGS_STARTUP";
export const SETTINGS_START = "SETTINGS_START";
export const SETTINGS_CHANGE_CONNECTION = "SETTINGS_CHANGE_CONNECTION";
export const SETTINGS_SAVE_NAV_STATE = "SETTINGS_SAVE_NAV_STATE";
export const SETTINGS_UPDATE_FCM_TOKEN = "SETTINGS_UPDATE_FCM_TOKEN";
export const CREATE_TOAST = "CREATE_TOAST";

export interface SettingsType {
  isConnected: boolean;
  navState?: Object; //NavState
  fcmToken?: string;
  toast: ToastType;
}

export interface ToastType {
  text: string;
  snapshot: number;
}

export interface SettingsChangeConnectionAction {
  type: typeof SETTINGS_CHANGE_CONNECTION;
  payload: {
    isConnected: boolean;
  };
}

export interface SettingsSaveNavStateAction {
  type: typeof SETTINGS_SAVE_NAV_STATE;
  payload: {
    navState: Object;
  };
}

export interface SettingsUpdateFCMAction {
  type: typeof SETTINGS_UPDATE_FCM_TOKEN;
  payload: {
    token: string;
  };
}

export interface SettingsStartAction {
  type: typeof SETTINGS_START;
}

export interface SettingsCreateToastAction {
  type: typeof CREATE_TOAST;
  payload: {
    toast: string;
  };
}

export interface SettingsStartUpAction {
  type: typeof SETTINGS_STARTUP;
}

export type TSettingsAction =
  | SettingsChangeConnectionAction
  | SettingsSaveNavStateAction
  | SettingsUpdateFCMAction
  | SettingsStartAction
  | SettingsCreateToastAction
  | SettingsStartUpAction;
