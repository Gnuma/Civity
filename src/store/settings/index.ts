import { ActionsObservable, StateObservable } from "redux-observable";
import { ThunkAction } from "redux-thunk";
import { Action, Store } from "redux";
import {
  SETTINGS_START,
  SETTINGS_CHANGE_CONNECTION,
  SETTINGS_SAVE_NAV_STATE,
  SETTINGS_UPDATE_FCM_TOKEN,
  CREATE_TOAST,
  SettingsType,
  TSettingsAction,
  ToastType,
  SettingsStartAction,
  SettingsChangeConnectionAction
} from "./types";
import { getItem } from "../utility";
import { searchRecentKey, searchUpdateHistory } from "../search";
import NetInfo from "@react-native-community/netinfo";
import { ofType } from "redux-observable";
import { fromEvent } from "rxjs";
import { switchMap, map, filter } from "rxjs/operators";
import { authDelayedLogin } from "../auth";
import firebase from "react-native-firebase";
import axios from "axios";
import { ___UPDATE_FCM___ } from "../endpoints";
import { StoreType } from "../root";

export const saveNavState = () => (navState: Object): TSettingsAction => ({
  type: SETTINGS_SAVE_NAV_STATE,
  payload: {
    navState
  }
});

export const createToast = (toast: string): TSettingsAction => ({
  type: CREATE_TOAST,
  payload: {
    toast
  }
});

const settingsConnectionChange = (isConnected: boolean): TSettingsAction => ({
  type: SETTINGS_CHANGE_CONNECTION,
  payload: {
    isConnected
  }
});

export const settingsStart = (): ThunkAction<
  void,
  SettingsType,
  null,
  Action
> => dispatch => {
  dispatch({
    type: SETTINGS_START
  });
  getItem(searchRecentKey)
    .then(recent => recent && dispatch(searchUpdateHistory(recent)))
    .catch(err => console.log(err));
};

export const updateFCMToken = (
  token: string
): ThunkAction<void, SettingsType, null, Action> => async dispatch => {
  try {
    if (!token) token = await firebase.messaging().getToken();
  } catch (error) {
    console.log(error);
  }
  if (token) {
    dispatch({
      type: SETTINGS_UPDATE_FCM_TOKEN,
      payload: {
        token
      }
    });
    axios
      .post(___UPDATE_FCM___, {
        id: token
      })
      .then(res => console.log(res))
      .catch(err => console.log({ err })); //ADD timeout
  }
};

//Epics

const settingsConnectionChangeEpic = (
  action$: ActionsObservable<SettingsStartAction>
) =>
  action$.pipe(
    ofType(SETTINGS_START),
    switchMap(() =>
      fromEvent(NetInfo.isConnected, "connectionChange").pipe(
        map(isConnected => settingsConnectionChange(isConnected))
      )
    )
  );

const settingsLoginDelayedEpic = (
  action$: ActionsObservable<SettingsChangeConnectionAction>,
  state$: StateObservable<StoreType>
) =>
  action$.pipe(
    ofType(SETTINGS_CHANGE_CONNECTION),
    filter(action => {
      console.log(action.payload.isConnected, state$.value.auth.delayedLogin);
      return action.payload.isConnected && state$.value.auth.delayedLogin;
    }),
    map(authDelayedLogin)
  );

export const settingsEpics = [
  settingsConnectionChangeEpic,
  settingsLoginDelayedEpic
];
