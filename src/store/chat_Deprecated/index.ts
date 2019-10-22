import { ActionsObservable, StateObservable } from "redux-observable";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import {
  CHAT_INIT,
  CHAT_CLEAR,
  CHAT_START_CHAT_ACTION,
  CHAT_START_GLOBAL_ACTION,
  CHAT_FAIL,
  CHAT_SINGLE_FAIL,
  CHAT_SET_SALES_LIST_FOCUS,
  CHAT_SET_SHOPPING_LIST_FOCUS,
  CHAT_SET_CHAT_FOCUS,
  CHAT_SET_COMPOSER,
  CHAT_RECEIVE_MSG,
  CHAT_SEND_MSG,
  CHAT_SYSTEM_MSG,
  CHAT_CONFIRM_MSG,
  CHAT_ERROR_MSG,
  CHAT_READ,
  CHAT_SETTLE,
  CHAT_LOAD_EARLIER,
  CHAT_CONTACT_USER,
  CHAT_NEW_ITEM,
  CHAT_MODIFY_ITEM,
  CHAT_NEW_CHAT,
  CHAT_START_STATUS_ACTION,
  CHAT_NEW_OFFERT,
  CHAT_REMOVE_OFFERT,
  CHAT_ACCEPT_OFFERT,
  CHAT_OFFERT_FAIL,
  CHAT_ONLINE,
  CHAT_SET_FEEDBACK,
  CHAT_DISABLE_ITEM,
  ChatStatus,
  FEEDBACK_TYPES,
  TextFeedbackTypes,
  ChatCategoryType,
  TChatActions,
  SalesData,
  ChatCategoryIdType,
  ChatIdentifierPayload,
  GeneralMessage,
  ChatSerializer,
  ChatSetChatFocusAction,
  ChatReceiveMessageAction,
  ChatSystemMsgAction,
  ChatSendMsgAction,
  ChatOnlineAction,
  InitSalesType,
  InitShoppingType,
  ChatCategorySecondaryType
} from "./types";
import uuid from "uuid";
import NetInfo from "@react-native-community/netinfo";
import {
  ___CREATE_OFFERT___,
  ___REJECT_OFFERT___,
  ___ACCEPT_OFFERT___,
  ___READ_CHAT___,
  ___CONTACT_USER___,
  ___SEND_MESSAGE___,
  ___RETRIEVE_CHATS___,
  ___LOAD_EARLIER_CHAT___,
  ___REQUEST_CONTACT___,
  ___ACCEPT_CHAT___,
  ___REJECT_CHAT___,
  ____CANCEL_OFFERT___,
  ___COMPLETE_EXCHANGE___,
  ___SEND_FEEDBACK___,
  ___DELTE_AD___
} from "../endpoints";

import protectedAction from "../../utils/protectedAction";
import axios from "axios";
import {
  map,
  filter,
  retryWhen,
  concatMap,
  delay,
  catchError
} from "rxjs/operators";
import { ofType } from "redux-observable";
import { ajax } from "rxjs/ajax";
import { of, fromEvent, throwError } from "rxjs";
import SystemMessages from "../../utils/SystemMessages";
import { authUpdateRespect, authUpdateExperience } from "../auth";
import { GeneralSubject, GeneralItem } from "../../types/ItemTypes";
import { UserSerializer, BasicUser } from "../../types/ProfileTypes";
import { StoreType } from "../root";

export const chatInit = (
  salesData: InitSalesType[],
  shoppingData: InitShoppingType[]
): TChatActions => ({
  type: CHAT_INIT,
  payload: {
    salesData,
    shoppingData
  }
});

export const chatClear = (): TChatActions => ({ type: CHAT_CLEAR });

export const chatStartGlobalAction = (): TChatActions => ({
  type: CHAT_START_GLOBAL_ACTION
});

export const chatStartChatAction = (
  objectID: ChatCategoryIdType,
  chatID: number
): TChatActions => ({
  type: CHAT_START_CHAT_ACTION,
  payload: {
    objectID,
    chatID
  }
});

export const chatFail = (error: unknown): TChatActions => ({
  type: CHAT_FAIL,
  payload: { error }
});

export const chatSingleFail = (
  objectID: ChatCategoryIdType,
  chatID: number,
  error: unknown
): TChatActions => ({
  type: CHAT_SINGLE_FAIL,
  payload: {
    objectID,
    chatID,
    error
  }
});

export const chatSetSalesListFocus = (
  focus: ChatCategoryIdType
): TChatActions => ({
  type: CHAT_SET_SALES_LIST_FOCUS,
  payload: { focus }
});

export const chatSetShoppingListFocus = (
  focus: ChatCategoryIdType
): TChatActions => ({
  type: CHAT_SET_SHOPPING_LIST_FOCUS,
  payload: { focus }
});

export const chatSetChatFocus = (
  objectID: ChatCategoryIdType,
  chatID: number
): TChatActions => ({
  type: CHAT_SET_CHAT_FOCUS,
  payload: { objectID, chatID }
});

export const chatSetComposer = (
  objectID: ChatCategoryIdType,
  chatID: number,
  value: string
): TChatActions => ({
  type: CHAT_SET_COMPOSER,
  payload: { value, objectID, chatID }
});

export const chatReceiveMessage = (
  objectID: ChatCategoryIdType,
  chatID: number,
  msg: GeneralMessage,
  type: ChatCategorySecondaryType
): TChatActions => ({
  type: CHAT_RECEIVE_MSG,
  payload: {
    objectID,
    chatID,
    msg,
    type
  }
});

export const chatSendMsg = (
  objectID: ChatCategoryIdType,
  chatID: number,
  msg: GeneralMessage,
  type: ChatCategoryType
): TChatActions => ({
  type: CHAT_SEND_MSG,
  payload: {
    objectID,
    chatID,
    msg,
    type
  }
});

export const chatSystemMsg = (
  objectID: ChatCategoryIdType,
  chatID: number,
  msg: string
): TChatActions => ({
  type: CHAT_SYSTEM_MSG,
  payload: {
    objectID,
    chatID,
    msg
  }
});

export const chatConfirmMsg = (
  objectID: ChatCategoryIdType,
  chatID: number,
  msgID: number,
  data: {
    isSending: boolean;
    _id: string;
  }
): TChatActions => ({
  type: CHAT_CONFIRM_MSG,
  payload: {
    objectID,
    chatID,
    msgID,
    data
  }
});

export const chatErrorMsg = (
  objectID: ChatCategoryIdType,
  chatID: number,
  msgID: number
): TChatActions => ({
  type: CHAT_ERROR_MSG,
  payload: {
    objectID,
    chatID,
    msgID
  }
});

export const chatStartStatusAction = (
  objectID: ChatCategoryIdType,
  chatID: number
): TChatActions => ({
  type: CHAT_START_STATUS_ACTION,
  payload: {
    objectID,
    chatID
  }
});

export const chatOffertFail = (
  objectID: ChatCategoryIdType,
  chatID: number,
  error: unknown
): TChatActions => ({
  type: CHAT_OFFERT_FAIL,
  payload: {
    objectID,
    chatID,
    error
  }
});

export const chatNewItem = (item: GeneralItem): TChatActions => ({
  type: CHAT_NEW_ITEM,
  payload: { item }
});

export const chatModifyItem = (item: GeneralItem): TChatActions => ({
  type: CHAT_MODIFY_ITEM,
  payload: { item }
});

export const chatOnline = (): TChatActions => ({
  type: CHAT_ONLINE
});

export const chatDisableItem = (
  type: ChatCategoryType,
  objectID: ChatCategoryIdType,
  chatID?: number
): TChatActions => ({
  type: CHAT_DISABLE_ITEM,
  payload: {
    type,
    objectID,
    chatID
  }
});

// ---THUNK---

// --ChatNotifications--

export const chatNewChat = (
  objectID: ChatCategoryIdType,
  chatID: number,
  data: ChatSerializer
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch({
    type: CHAT_NEW_CHAT,
    payload: {
      objectID,
      chatID,
      data
    }
  });
  dispatch(
    chatSystemMsg(
      objectID,
      chatID,
      SystemMessages.newChat(getUserTO(getState, { objectID, chatID }))
    )
  );
};

export const chatNewOffert = (
  objectID: ChatCategoryIdType,
  chatID: number,
  offertID: number,
  price: number,
  user: UserSerializer
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch({
    type: CHAT_NEW_OFFERT,
    payload: {
      price,
      objectID,
      chatID,
      pk: offertID,
      user
    }
  });
  user = user || getState().chat.data[objectID].chats[chatID].UserTO;
  dispatch(
    chatSystemMsg(
      objectID,
      chatID,
      SystemMessages.sendOffert(user.user.username, price)
    )
  );
};

export const chatSetOffertAccepted = (
  objectID: ChatCategoryIdType,
  chatID: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch({
    type: CHAT_ACCEPT_OFFERT,
    payload: {
      objectID,
      chatID
    }
  });
  const username = getOffertDeciderUsername(getState, { objectID, chatID });
  dispatch(
    chatSystemMsg(objectID, chatID, SystemMessages.acceptOffert(username))
  );
};

export const chatRemoveOffert = (
  objectID: ChatCategoryIdType,
  chatID: number,
  isRejected: boolean
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch({
    type: CHAT_REMOVE_OFFERT,
    payload: {
      objectID,
      chatID
    }
  });
  if (isRejected) {
    const username = getOffertDeciderUsername(getState, { objectID, chatID });
    dispatch(
      chatSystemMsg(objectID, chatID, SystemMessages.rejectOffert(username))
    );
  } else {
    const username = getOffertCreatorUsername(getState, { objectID, chatID });
    dispatch(
      chatSystemMsg(objectID, chatID, SystemMessages.cancelOffert(username))
    );
  }
};

export const chatSettleAction = (
  objectID: ChatCategoryIdType,
  chatID: number,
  status: ChatStatus
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch({
    type: CHAT_SETTLE,
    payload: {
      objectID,
      chatID,
      status
    }
  });
  switch (status) {
    case ChatStatus.PROGRESS:
      return dispatch(
        chatSystemMsg(
          objectID,
          chatID,
          SystemMessages.acceptChat(getSeller(getState, { objectID, chatID }))
        )
      );

    case ChatStatus.FEEDBACK:
      dispatch(
        authUpdateExperience(String(objectID).charAt(0) == "s" ? 50 : 100)
      );
      return dispatch(
        chatSystemMsg(
          objectID,
          chatID,
          SystemMessages.completeExchange(
            getSeller(getState, { objectID, chatID })
          )
        )
      );

    case ChatStatus.BLOCKED:
      return dispatch(
        chatSystemMsg(objectID, chatID, SystemMessages.blockItem())
      );

    default:
      break;
  }
};

export const chatSetFeedback = (
  objectID: ChatCategoryIdType,
  chatID: number,
  feedback: FEEDBACK_TYPES,
  comment: string,
  fromWS?: boolean
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  console.log(objectID, chatID, feedback, comment);
  dispatch({
    type: CHAT_SET_FEEDBACK,
    payload: {
      objectID,
      chatID,
      feedback,
      comment,
      fromWS
    }
  });

  const user = fromWS
    ? getUserTO(getState, { objectID, chatID })
    : getUser(getState);
  dispatch(
    chatSystemMsg(
      objectID,
      chatID,
      SystemMessages.sendFeedback(
        user,
        TextFeedbackTypes[feedback].toLowerCase()
      )
    )
  );

  const feedbacks = getState().chat.data[objectID].chats[chatID].feedbacks;
  if (feedbacks.seller != undefined && feedbacks.buyer != undefined) {
    let isBuyer = false;
    let judgment;
    if (String(objectID).charAt(0) == "s") {
      isBuyer = true;
      judgment = feedbacks.buyer.judgment;
    } else {
      isBuyer = false;
      judgment = feedbacks.seller.judgment;
    }
    dispatch(
      authUpdateRespect(
        judgment == FEEDBACK_TYPES.POSITIVE,
        isBuyer ? ChatCategoryType.shopping : ChatCategoryType.sales
      )
    );
  }
};

// --ChatNotifications--

export const chatSend = (
  type: ChatCategoryType,
  objectID: ChatCategoryIdType,
  chatID: number,
  content: string
): ThunkAction<void, StoreType, null, Action> => {
  return (dispatch, getState) => {
    const myID = getState().auth.id;
    //const content = getState().chat.data[objectID].chats[chatID].composer;
    if (!myID) throw "Can't send msg. User not authenticated";
    const msg = createMsg(content, myID);
    dispatch(chatSendMsg(objectID, chatID, msg, type));
  };
};

export const chatRead = (
  objectID: ChatCategoryIdType,
  chatID: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  const chat = getState().chat.data[objectID].chats[chatID];
  console.log(chat.hasNews);
  if (chat.hasNews) {
    try {
      const messagesToRead = chat.hasNews;
      axios
        .post(___READ_CHAT___, {
          chat: chatID,
          messages: messagesToRead
        })
        .then(res => console.log(res))
        .catch(err => console.log({ err }));
      dispatch({
        type: CHAT_READ,
        payload: {
          objectID,
          chatID
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Chat had no news");
  }
};

export const chatSettle = (
  objectID: ChatCategoryIdType,
  chatID: number,
  isAccepting: boolean
): ThunkAction<void, StoreType, null, Action> => dispatch => {
  dispatch(chatStartChatAction(objectID, chatID));
  if (isAccepting) {
    axios
      .post(___ACCEPT_CHAT___, {
        chat: chatID
      })
      .then(res =>
        dispatch(chatSettleAction(objectID, chatID, ChatStatus.PROGRESS))
      )
      .catch(err => dispatch(chatSingleFail(objectID, chatID, err)));
  } else {
    axios
      .post(___REJECT_CHAT___, {
        chat: chatID
      })
      .then(res =>
        dispatch(chatSettleAction(objectID, chatID, ChatStatus.REJECTED))
      )
      .catch(err => dispatch(chatSingleFail(objectID, chatID, err)));
  }
};

export const chatRequestContact = (
  objectID: ChatCategoryIdType,
  chatID: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch(chatStartChatAction(objectID, chatID));
  //API
  axios
    .post(___REQUEST_CONTACT___, {
      chat: chatID
    })
    .then(res => {
      dispatch(chatSettleAction(objectID, chatID, ChatStatus.PENDING));
      dispatch(
        chatSystemMsg(
          objectID,
          chatID,
          SystemMessages.newChat(getUser(getState))
        )
      );
    })
    .catch(err => {
      console.log({ err });
      dispatch(chatSingleFail(objectID, chatID, err));
    });
};

export const chatLoadEarlier = (
  objectID: ChatCategoryIdType,
  chatID: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  const chat = getState().chat.data[objectID].chats[chatID];
  const messages = chat.messages;
  if (messages.length > 0 && !chat.loading && chat.toload) {
    dispatch(chatStartChatAction(objectID, chatID));
    const last = messages[messages.length - 1]._id;
    console.log("Loading earlier: ", chatID, last);
    axios
      .post(___LOAD_EARLIER_CHAT___, {
        chat: chatID,
        last
      })
      .then(res => {
        dispatch({
          type: CHAT_LOAD_EARLIER,
          payload: {
            objectID,
            chatID,
            data: res.data.messages,
            toload: res.data.toload
          }
        });
        console.log("Loading earlier results: ", res);
      })
      .catch(err => console.log({ err }));
  }
};

export const chatContactUser = (
  item: GeneralItem
): ThunkAction<void, StoreType, null, Action> => dispatch =>
  new Promise<{ chatID: number; subjectID: string }>((resolve, reject) => {
    protectedAction()
      .then(() =>
        axios.post(___CONTACT_USER___, {
          item: item.pk
        })
      )
      .then((res: any) => {
        console.log(res);
        dispatch({
          type: CHAT_CONTACT_USER,
          payload: {
            item: item,
            chatID: res.data._id
          }
        });
        resolve({
          chatID: res.data._id,
          subjectID: "s" + item.book.subject._id
        });
      })
      .catch((err: any) => {
        console.log({ err });
        dispatch(chatFail(err));
        reject();
      });
  });

export const chatCreateOffert = (
  objectID: ChatCategoryIdType,
  chatID: number,
  price: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch(chatStartStatusAction(objectID, chatID));
  axios
    .post(___CREATE_OFFERT___, {
      offert: price,
      chat: chatID
    })
    .then(res => {
      console.log(res);
      const { userData, id, office } = getState().auth;
      if (!id || !office) throw "Not Authenticated";
      const user: UserSerializer = {
        _id: id,
        respect: userData.respect,
        usertype: userData.usertype,
        xp: userData.xp,
        user: { username: userData.username },
        course: {
          ...office.course,
          office: {
            ...office
          }
        }
      };
      dispatch(chatNewOffert(objectID, chatID, res.data.pk, price, user));
    })
    .catch(err => {
      console.log({ err });
      dispatch(chatOffertFail(objectID, chatID, err));
    });
};

export const chatCancelOffert = (
  objectID: ChatCategoryIdType,
  chatID: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch(chatStartStatusAction(objectID, chatID));
  const offertID = getState().chat.data[objectID].chats[chatID].offerts[0]._id;
  axios
    .post(____CANCEL_OFFERT___, {
      offert: offertID
    })
    .then(res => {
      console.log(res);
      dispatch(chatRemoveOffert(objectID, chatID, false));
    })
    .catch(err => {
      dispatch(chatOffertFail(objectID, chatID, err));
    });
};

export const chatRejectOffert = (
  objectID: ChatCategoryIdType,
  chatID: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch(chatStartStatusAction(objectID, chatID));
  const offertID = getState().chat.data[objectID].chats[chatID].offerts[0]._id;
  axios
    .post(___REJECT_OFFERT___, {
      offert: offertID
    })
    .then(res => {
      console.log(res);
      dispatch(chatRemoveOffert(objectID, chatID, true));
    })
    .catch(err => {
      dispatch(chatOffertFail(objectID, chatID, err));
    });
};

export const chatAcceptOffert = (
  objectID: ChatCategoryIdType,
  chatID: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  dispatch(chatStartStatusAction(objectID, chatID));
  const offertID = getState().chat.data[objectID].chats[chatID].offerts[0]._id;
  axios
    .post(___ACCEPT_OFFERT___, {
      offert: offertID
    })
    .then(res => {
      console.log(res);
      dispatch(chatSetOffertAccepted(objectID, chatID));
    })
    .catch(err => {
      dispatch(chatOffertFail(objectID, chatID, err));
    });
};

export const chatBlockItem = (
  itemID: ChatCategoryIdType,
  excludedChat: number
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  console.log(itemID, excludedChat);
  const chats = getState().chat.data[itemID].chats;
  for (let chatSID in chats) {
    console.log(chatSID, excludedChat);
    const chatID = parseInt(chatSID);
    if (chats.hasOwnProperty(chatID) && chatID != excludedChat) {
      dispatch(chatSettleAction(itemID, chatID, ChatStatus.BLOCKED));
    }
  }
  dispatch(chatDisableItem(ChatCategoryType.sales, itemID));
};

export const chatCompleteExchange = (
  objectID: ChatCategoryIdType,
  chatID: number
): ThunkAction<void, StoreType, null, Action> => dispatch => {
  dispatch(chatStartStatusAction(objectID, chatID));
  axios
    .post(___COMPLETE_EXCHANGE___, {
      chat: chatID
    })
    .then(res => {
      console.log(res);
      dispatch(chatSettleAction(objectID, chatID, ChatStatus.FEEDBACK));
      dispatch(chatBlockItem(objectID, chatID));
    })
    .catch(err => {
      console.log({ err });
      dispatch(chatOffertFail(objectID, chatID, err));
    });
};

export const chatSendFeedback = (
  objectID: ChatCategoryIdType,
  chatID: number,
  feedback: FEEDBACK_TYPES,
  comment: string
): ThunkAction<void, StoreType, null, Action> => dispatch => {
  dispatch(chatStartStatusAction(objectID, chatID));
  const data = {
    chat: chatID,
    judgment: feedback,
    comment: ""
  };
  if (comment) {
    data.comment = comment;
  }
  axios
    .post(___SEND_FEEDBACK___, data)
    .then(res => {
      console.log(res);
      dispatch(chatSetFeedback(objectID, chatID, feedback, comment, false));
    })
    .catch(err => {
      console.log({ err });
      dispatch(chatOffertFail(objectID, chatID, err));
    });
};

export const onNewMessage = (
  objectID: ChatCategoryIdType,
  chatID: number,
  msg: GeneralMessage,
  type: ChatCategorySecondaryType
): ThunkAction<void, StoreType, null, Action> => (dispatch, getState) => {
  const state = getState().chat;
  dispatch(chatReceiveMessage(objectID, chatID, msg, type));
  if (state.chatFocus === chatID) {
    dispatch(chatRead(objectID, chatID));
  }
};

export const chatRestart = (): ThunkAction<
  void,
  StoreType,
  null,
  Action
> => dispatch => {
  axios
    .get(___RETRIEVE_CHATS___)
    .then(res => {
      dispatch(chatInit(res.data.sales, res.data.shopping));
    })
    .catch(err => dispatch(chatFail(err)));
};

//  ---EPICS---
//newMessage inChat || open chat
const readChatEpic = (
  action$: ActionsObservable<
    ChatSetChatFocusAction | ChatReceiveMessageAction | ChatSystemMsgAction
  >,
  state$: StateObservable<StoreType>
) =>
  action$.pipe(
    ofType(CHAT_SET_CHAT_FOCUS, CHAT_RECEIVE_MSG, CHAT_SYSTEM_MSG),
    filter(action => {
      const { chatID } = action.payload;
      return chatID !== null && state$.value.chat.chatFocus === chatID;
    }),
    map(action => {
      const { objectID, chatID } = action.payload;
      return chatRead(objectID, chatID);
    })
  );

const sendMessageEpic = (
  action$: ActionsObservable<ChatSendMsgAction | ChatOnlineAction>,
  state$: StateObservable<StoreType>
) =>
  action$.pipe(
    ofType(CHAT_SEND_MSG, CHAT_ONLINE),
    concatMap(action => {
      if (action.type === CHAT_ONLINE) return of(chatRestart());
      const { chatID, objectID, msg } = action.payload;
      return ajax
        .post(
          ___SEND_MESSAGE___,
          {
            chat: chatID,
            content: msg.text
          },
          {
            Authorization: "Token " + state$.value.auth.token
          }
        )
        .pipe(
          retryWhen(errorSubject =>
            errorSubject.pipe(
              concatMap((err, i) => {
                console.log(err);
                if (err.message == "ajax error") {
                  return fromEvent(NetInfo, "connectionChange");
                } else {
                  if (i < 3) {
                    return of(err).pipe(delay(100));
                  } else {
                    return throwError(err);
                  }
                }
              })
            )
          ),
          catchError(err => of(CHAT_ERROR_MSG)),
          map(res => {
            console.log(res);
            return res === CHAT_ERROR_MSG
              ? chatErrorMsg(objectID, chatID, parseInt(msg._id.toString()))
              : chatConfirmMsg(objectID, chatID, parseInt(msg._id.toString()), {
                  isSending: false,
                  _id: uuid.v4()
                });
          })
        );
    })
  );

export const chatEpics = [readChatEpic, sendMessageEpic];

const createMsg = (content: string, userID: number): GeneralMessage => {
  return {
    _id: uuid.v4(),
    createdAt: new Date(),
    is_read: true,
    text: content,
    user: {
      _id: userID
    },
    system: false,
    isSending: true
  };
};

/**
 * Utils
 */

const getOffertCreatorUsername = (
  getState: () => StoreType,
  { objectID, chatID }: ChatIdentifierPayload
) => {
  try {
    return getState().chat.data[objectID].chats[chatID].offerts[0].creator.user
      .username;
  } catch (error) {
    console.warn(error);
    console.log(error, "for: ", { objectID, chatID });
  }
};

const getOffertDeciderUsername = (
  getState: () => StoreType,
  { objectID, chatID }: ChatIdentifierPayload
) => {
  try {
    const offertCreator = getState().chat.data[objectID].chats[chatID]
      .offerts[0].creator;
    const userTo = getState().chat.data[objectID].chats[chatID].UserTO;
    const username =
      offertCreator._id !== userTo._id
        ? userTo.user.username
        : getState().auth.userData.username;
    return username;
  } catch (error) {
    console.warn(error);
    console.log(error, "for: ", { objectID, chatID });
  }
};

const getUserTO = (
  getState: () => StoreType,
  { objectID, chatID }: ChatIdentifierPayload
) => {
  try {
    return getState().chat.data[objectID].chats[chatID].UserTO.user.username;
  } catch (error) {
    console.warn(error);
    console.log(error, "for: ", { objectID, chatID });
  }
};

const getUser = (getState: () => StoreType) => {
  try {
    return getState().auth.userData.username;
  } catch (error) {
    console.warn(error);
  }
};

const getSeller = (getState: () => StoreType, data: ChatIdentifierPayload) => {
  console.log(data.objectID, String(data.objectID).charAt(0) === "s");
  return String(data.objectID).charAt(0) === "s"
    ? getUserTO(getState, data)
    : getUser(getState);
};
