import * as actionTypes from "./actionTypes";
import NetInfo from "@react-native-community/netinfo";
import { ofType } from "redux-observable";
import { fromEvent } from "rxjs";
import { switchMap, map, filter } from "rxjs/operators";
import { authDelayedLogin } from "./auth";
import { getItem, setItem } from "../utility";
import { searchRecentKey, searchUpdateHistory } from "./search";
import firebase from "react-native-firebase";
import axios from "axios";
import { ___UPDATE_FCM___ } from "../constants";

const fcmToken = "@settings:fcmToken";

export const settingsStart = () => dispatch => {
  dispatch({
    type: actionTypes.SETTINGS_START
  });

  getItem(searchRecentKey)
    .then(recent => recent && dispatch(searchUpdateHistory(recent)))
    .catch(err => console.log(err));

  //dispatch(updateFCMToken());
};

export const saveNavState = () => navState => ({
  type: actionTypes.SETTINGS_SAVE_NAV_STATE,
  payload: {
    navState
  }
});

export const updateFCMToken = token => async dispatch => {
  let oldToken;
  try {
    if (!token) token = await firebase.messaging().getToken();
    oldToken = await getItem(fcmToken);
  } catch (error) {
    console.log(error);
  }

  if (token) {
    dispatch({
      type: actionTypes.SETTINGS_UPDATE_FCM_TOKEN,
      payload: {
        token
      }
    });
    setItem(fcmToken, token);

    axios
      .post(___UPDATE_FCM___, {
        id: token
      })
      .then(res => console.log(res))
      .catch(err => console.log({ err })); //ADD timeout
  }
};

const settingsConnectionChange = isConnected => ({
  type: actionTypes.SETTINGS_CHANGE_CONNECTION,
  payload: {
    isConnected
  }
});

const settingsConnectionChangeEpic = (action$, state$) =>
  action$.pipe(
    ofType(actionTypes.SETTINGS_START),
    switchMap(() =>
      fromEvent(NetInfo.isConnected, "connectionChange").pipe(
        map(isConnected => settingsConnectionChange(isConnected))
      )
    )
  );

const settingsLoginDelayedEpic = (action$, state$) =>
  action$.pipe(
    ofType(actionTypes.SETTINGS_CHANGE_CONNECTION),
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

/*
  setTimeout(() => {
    const notification = new firebase.notifications.Notification()
      .setNotificationId("1234")
      .setTitle("Title")
      .setBody("Body")
      .setData({
        key1: "aoo",
        ke2: "asd"
      })
      .android.setChannelId("channelID")
      .android.setPriority(firebase.notifications.Android.Priority.High);

    firebase.notifications().displayNotification(notification);
    console.log("Test Notification");
  }, 6000);
*/
