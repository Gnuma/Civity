import { ActionsObservable, StateObservable, ofType } from "redux-observable";
import {
  switchMap,
  filter,
  map,
  mergeMap,
  takeUntil,
  bufferWhen,
  buffer,
  ignoreElements,
  tap
} from "rxjs/operators";
import { forkJoin, pipe } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import { ajax } from "rxjs/ajax";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";

import {
  ChatState,
  TChatActions,
  CHAT_CONNECT,
  CHAT_DISCONNECT,
  CHAT_SOCKET_MSG,
  CHAT_BUFFER,
  ChatSocketMsgAction,
  CHAT_FAIL,
  ResumeMessages,
  CHAT_RESUME
} from "./types";

import uuid from "uuid";
import NetInfo from "@react-native-community/netinfo";
import { ___WS_TEST_ENDPOINT, ___RETRIEVE_CHATS___ } from "../endpoints";
import { StoreType } from "../root";
import { SETTINGS_STARTUP, SettingsStartUpAction } from "../settings/types";
import { WebSocket } from "mock-socket";
import axios from "axios";
import { generateMessageResume } from "../../utils/MockWS";

export const chatConnect = (): TChatActions => ({
  type: CHAT_CONNECT
});

export const chatDisconnect = (): TChatActions => ({
  type: CHAT_DISCONNECT
});

export const chatBuffer = (): TChatActions => ({
  type: CHAT_BUFFER
});

export const chatSocketMsg = (data: any): TChatActions => ({
  type: CHAT_SOCKET_MSG,
  payload: data
});

export const chatFail = (error: unknown): TChatActions => ({
  type: CHAT_FAIL,
  payload: {
    error
  }
});

export const chatResume = (data: ResumeMessages[]): TChatActions => ({
  type: CHAT_RESUME,
  payload: {
    data
  }
});

/**
 * THUNK
 */

export const chatReconnect = (): ThunkAction<void, StoreType, null, Action> => (
  dispatch,
  getState
) => {
  //Test
  setTimeout(() => {
    dispatch(chatBuffer());
    dispatch(chatResume(generateMessageResume(1)));
    dispatch(chatConnect());
  }, 1000);

  //axios
  //  .get(___RETRIEVE_CHATS___)
  //  .then(res => {
  //    /**
  //     * Dispatch this sequence
  //     * 1) Buffer Chat
  //     * 2) Reduce retrieved data
  //     * 3) Connect Chat
  //     */
  //    dispatch(chatBuffer());
  //    //ToDoReduce
  //    dispatch(chatResume(res.data));
  //    dispatch(chatConnect());
  //  })
  //  .catch(err => {
  //    /**
  //     * 1)
  //     * dispatch error
  //     * 2)
  //     * If I have connection -> retry in t time (Server error)
  //     * Else -> Stop trying (No Connection)
  //     *
  //     * If error is login error then logout
  //     */
  //    dispatch(chatFail(err));
  //    if (getState().settings.isConnected)
  //      setTimeout(() => dispatch(chatReconnect()), 5000);
  //  });
};

/**
 * EPICS
 */

const socket$ = webSocket({
  url: ___WS_TEST_ENDPOINT,
  //WebSocketCtor
  WebSocketCtor: WebSocket
});

const webSocketEpic = (
  action$: ActionsObservable<SettingsStartUpAction>,
  state$: StateObservable<StoreType>
) => {
  return action$.pipe(
    ofType(SETTINGS_STARTUP),
    mergeMap(action => {
      return socket$.pipe(
        //takeUntil(action$.ofType(CHAT_END_WS)),
        //buffer(filter(() => state$.value.chat.state === ChatState.CONNECTED)),
        //filter(buffer => buffer.length > 0),
        /*map(msg => {
          console.log(msg);
          return { type: "message" };
        }),*/
        //tap(msg => console.log(msg)),
        map(msg => chatSocketMsg(msg))
      );
    })
  );
};

const chatMessageEpic = (
  action$: ActionsObservable<ChatSocketMsgAction>,
  state$: StateObservable<StoreType>
) => {
  return action$.pipe(
    ofType(CHAT_SOCKET_MSG),
    filter(
      () =>
        state$.value.chat && state$.value.chat.state !== ChatState.DISCONNECTED
    ),
    bufferWhen(() =>
      action$.pipe(
        filter(() => {
          return (
            state$.value.chat && state$.value.chat.state === ChatState.CONNECTED
          );
        })
      )
    ),
    filter(buffer => {
      return buffer.length > 0;
    }),
    map(msg => ({ type: "n messages " + msg.length }))
  );
};

export const chatEpics = [webSocketEpic, chatMessageEpic];

/*
const webSocketEpic = (
  action$: ActionsObservable<SettingsStartUpAction>,
  state$: StateObservable<StoreType>
) =>
  action$.pipe(
    ofType(SETTINGS_STARTUP),
    mergeMap(action => {
      const bufferNotification$ = action$.pipe(
        filter(() => state$.value.chat.state === ChatState.CONNECTED)
      );
      return socket$.pipe(
        takeUntil(action$.ofType(CHAT_END_WS)),
        buffer(bufferNotification$),
        map(msg => ({ type: "message" }))
      );
    })
  );
*/
