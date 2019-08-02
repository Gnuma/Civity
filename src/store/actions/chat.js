import * as actionTypes from "./actionTypes";
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
} from "../constants";
import { loadMockNew } from "../../mockData/Chat2";
import protectedAction from "../../utils/protectedAction";
import axios from "axios";
import NavigationService from "../../navigator/NavigationService";
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
import { of, timer, interval, fromEvent, throwError, iif } from "rxjs";
import {
  ChatStatus,
  FEEDBACK_TYPES,
  TextFeedbackTypes
} from "../../utils/constants";
import SystemMessages from "../../utils/SystemMessages";

export const chatInit = (salesData, shoppingData) => ({
  type: actionTypes.CHAT_INIT,
  payload: {
    salesData,
    shoppingData
  }
});

export const chatClear = () => ({ type: actionTypes.CHAT_CLEAR });

export const chatStartGlobalAction = () => ({
  type: actionTypes.CHAT_START_GLOBAL_ACTION
});

export const chatStartChatAction = (objectID, chatID) => ({
  type: actionTypes.CHAT_START_CHAT_ACTION,
  payload: {
    objectID,
    chatID
  }
});

export const chatFail = error => ({
  type: actionTypes.CHAT_FAIL,
  payload: { error }
});

export const chatSingleFail = (objectID, chatID, error) => ({
  type: actionTypes.CHAT_SINGLE_FAIL,
  payload: {
    objectID,
    chatID,
    error
  }
});

export const chatSetSalesListFocus = focus => ({
  type: actionTypes.CHAT_SET_SALES_LIST_FOCUS,
  payload: { focus }
});

export const chatSetShoppingListFocus = focus => ({
  type: actionTypes.CHAT_SET_SHOPPING_LIST_FOCUS,
  payload: { focus }
});

export const chatSetChatFocus = (objectID, chatID) => ({
  type: actionTypes.CHAT_SET_CHAT_FOCUS,
  payload: { objectID, chatID }
});

export const chatSetComposer = (objectID, chatID, value) => ({
  type: actionTypes.CHAT_SET_COMPOSER,
  payload: { value, objectID, chatID }
});

export const chatReceiveMessage = (objectID, chatID, msg, type) => ({
  type: actionTypes.CHAT_RECEIVE_MSG,
  payload: {
    objectID,
    chatID,
    msg,
    type
  }
});

export const chatSendMsg = (objectID, chatID, msg, type) => ({
  type: actionTypes.CHAT_SEND_MSG,
  payload: {
    objectID,
    chatID,
    msg,
    type
  }
});

export const chatSystemMsg = (objectID, chatID, msg) => ({
  type: actionTypes.CHAT_SYSTEM_MSG,
  payload: {
    objectID,
    chatID,
    msg
  }
});

export const chatConfirmMsg = (objectID, chatID, msgID, data) => ({
  type: actionTypes.CHAT_CONFIRM_MSG,
  payload: {
    objectID,
    chatID,
    msgID,
    data
  }
});

export const chatErrorMsg = (objectID, chatID, msgID) => ({
  type: actionTypes.CHAT_ERROR_MSG,
  payload: {
    objectID,
    chatID,
    msgID
  }
});

export const chatNewChat = (objectID, chatID, data) => ({
  type: actionTypes.CHAT_NEW_CHAT,
  payload: {
    objectID,
    chatID,
    data
  }
});

export const chatStartStatusAction = (objectID, chatID) => ({
  type: actionTypes.CHAT_START_STATUS_ACTION,
  payload: {
    objectID,
    chatID
  }
});

export const chatOffertFail = (objectID, chatID, error) => ({
  type: actionTypes.CHAT_OFFERT_FAIL,
  payload: {
    objectID,
    chatID,
    error
  }
});

export const chatNewItem = item => ({
  type: actionTypes.CHAT_NEW_ITEM,
  payload: { item }
});

export const chatModifyItem = item => ({
  type: actionTypes.CHAT_MODIFY_ITEM,
  payload: { item }
});

export const chatOnline = () => ({
  type: actionTypes.CHAT_ONLINE
});

export const chatBlockItem = (itemID, excludedChat) => ({
  type: actionTypes.CHAT_BLOCK_ITEM,
  payload: {
    itemID,
    excludedChat
  }
});

export const chatBlockChat = (objectID, chatID) => ({
  type: actionTypes.CHAT_BLOCK_CHAT,
  payload: {
    objectID,
    chatID
  }
});

// ---THUNK---

// --ChatNotifications--

export const chatNewOffert = (objectID, chatID, offertID, price, user) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.CHAT_NEW_OFFERT,
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

export const chatSetOffertAccepted = (objectID, chatID) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.CHAT_ACCEPT_OFFERT,
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

export const chatRemoveOffert = (objectID, chatID, isRejected) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.CHAT_REMOVE_OFFERT,
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

export const chatSettleAction = (objectID, chatID, status) => (
  dispatch,
  getState
) => {
  dispatch({
    type: actionTypes.CHAT_SETTLE,
    payload: {
      objectID,
      chatID,
      status
    }
  });
  switch (status) {
    case ChatStatus.PROGRESS:
      dispatch(
        chatSystemMsg(
          objectID,
          chatID,
          SystemMessages.acceptChat(getUserTO(getState, { objectID, chatID }))
        )
      );
      break;

    case ChatStatus.FEEDBACK:
      dispatch(
        chatSystemMsg(objectID, chatID, SystemMessages.completeExchange())
      );

    default:
      break;
  }
};

export const chatSetFeedback = (
  objectID,
  chatID,
  feedback,
  comment,
  fromWS
) => (dispatch, getState) => {
  console.log(objectID, chatID, feedback, comment);
  dispatch({
    type: actionTypes.CHAT_SET_FEEDBACK,
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
};

// --ChatNotifications--

export const chatSend = (type, objectID, chatID) => {
  return (dispatch, getState) => {
    const myID = getState().auth.id;
    const content = getState().chat.data[objectID].chats[chatID].composer;
    const msg = createMsg(content, myID);

    dispatch(chatSendMsg(objectID, chatID, msg, type));
  };
};

export const chatRead = (objectID, chatID) => (dispatch, getState) => {
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
        type: actionTypes.CHAT_READ,
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

export const chatSettle = (objectID, chatID, isAccepting) => dispatch => {
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

export const chatRequestContact = (objectID, chatID) => dispatch => {
  dispatch(chatStartChatAction(objectID, chatID));
  //API
  axios
    .post(___REQUEST_CONTACT___, {
      chat: chatID
    })
    .then(res =>
      dispatch(chatSettleAction(objectID, chatID, ChatStatus.PENDING))
    )
    .catch(err => dispatch(chatSingleFail(objectID, chatID, err)));
};

export const chatLoadEarlier = (objectID, chatID) => (dispatch, getState) => {
  const chat = getState().chat.data[objectID].chats[chatID];
  const messages = chat.messages;
  if (messages.length > 0 && !chat.loading && chat.toload) {
    dispatch(chatStartChatAction(objectID, chatID));
    const last = messages[messages.length - 1]._id;
    axios
      .post(___LOAD_EARLIER_CHAT___, {
        chat: chatID,
        last
      })
      .then(res => {
        dispatch({
          type: actionTypes.CHAT_LOAD_EARLIER,
          payload: {
            objectID,
            chatID,
            data: res.data.messages,
            toload: res.data.toload
          }
        });
      })
      .catch(err => console.log({ err }));
  }
};

export const chatContactUser = item => dispatch =>
  new Promise((resolve, reject) => {
    protectedAction()
      .then(() =>
        axios.post(___CONTACT_USER___, {
          item: item.pk
        })
      )
      .then(res => {
        console.log(res);
        /*
      This API returns the object ITEM but is up until now 12/07/2019 incomplete
      */
        dispatch({
          type: actionTypes.CHAT_CONTACT_USER,
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
      .catch(err => {
        dispatch(chatFail(err));
        reject();
      });
  });

export const chatCreateOffert = (objectID, chatID, price) => (
  dispatch,
  getState
) => {
  dispatch(chatStartStatusAction(objectID, chatID));
  axios
    .post(___CREATE_OFFERT___, {
      offert: price,
      chat: chatID
    })
    .then(res => {
      console.log(res);
      const {
        userData: { username },
        id
      } = getState().auth;
      dispatch(
        chatNewOffert(objectID, chatID, res.data.pk, price, {
          _id: id,
          user: {
            username
          }
        })
      );
    })
    .catch(err => {
      console.log({ err });
      dispatch(chatOffertFail(objectID, chatID, err));
    });
};

export const chatCancelOffert = (objectID, chatID) => (dispatch, getState) => {
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

export const chatRejectOffert = (objectID, chatID) => (dispatch, getState) => {
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

export const chatAcceptOffert = (objectID, chatID) => (dispatch, getState) => {
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

export const chatCompleteExchange = (objectID, chatID) => dispatch => {
  dispatch(chatStartStatusAction(objectID, chatID));
  axios
    .post(___COMPLETE_EXCHANGE___, {
      chat: chatID
    })
    .then(res => {
      console.log(res);
      dispatch(chatSettleAction(objectID, chatID, ChatStatus.FEEDBACK));
    })
    .catch(err => {
      dispatch(chatOffertFail(objectID, chatID, err));
    });
};

export const chatSendFeedback = (
  objectID,
  chatID,
  feedback,
  comment
) => dispatch => {
  dispatch(chatStartStatusAction(objectID, chatID));
  axios
    .post(___SEND_FEEDBACK___, {
      chat: chatID,
      judgment: feedback,
      comment: comment
    })
    .then(res => {
      console.log(res);
      dispatch(chatSetFeedback(objectID, chatID, feedback, comment, false));
    })
    .catch(err => {
      dispatch(chatOffertFail(objectID, chatID, err));
    });
};

export const onNewMessage = (objectID, chatID, msg, type) => (
  dispatch,
  getState
) => {
  const state = getState().chat;
  dispatch(chatReceiveMessage(objectID, chatID, msg, type));
  if (state.chatFocus === chatID) {
    dispatch(chatRead(objectID, chatID));
  }
};

export const chatRestart = () => dispatch => {
  axios
    .get(___RETRIEVE_CHATS___)
    .then(res => {
      dispatch(chatInit(res.data.sales, res.data.shopping));
    })
    .catch(err => dispatch(chatFail(err)));
};

//  ---EPICS---
//newMessage inChat || open chat
const readChatEpic = (action$, state$) =>
  action$.pipe(
    ofType(actionTypes.CHAT_SET_CHAT_FOCUS, actionTypes.CHAT_RECEIVE_MSG),
    filter(action => {
      const { chatID } = action.payload;
      return chatID !== null && state$.value.chat.chatFocus === chatID;
    }),
    map(action => {
      const { objectID, chatID } = action.payload;
      return chatRead(objectID, chatID);
    })
  );

const sendMessageEpic = (action$, state$) =>
  action$.pipe(
    ofType(actionTypes.CHAT_SEND_MSG, actionTypes.CHAT_ONLINE),
    concatMap(action => {
      if (action.type === actionTypes.CHAT_ONLINE) return of(chatRestart());
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
          catchError(err => of(actionTypes.CHAT_ERROR_MSG)),
          map(res => {
            console.log(res);
            return res === actionTypes.CHAT_ERROR_MSG
              ? chatErrorMsg(objectID, chatID, msg._id)
              : chatConfirmMsg(objectID, chatID, msg._id, {
                  isSending: false,
                  _id: uuid.v4()
                });
          })
        );
    })
  );

export const chatEpics = [readChatEpic, sendMessageEpic];

const createMsg = (content, userID) => {
  return {
    _id: uuid.v4(),
    text: content,
    createdAt: new Date(),
    user: {
      _id: userID
    },
    isRead: true,
    isSending: true
  };
};

const getOffertCreatorUsername = (getState, { objectID, chatID }) => {
  try {
    return getState().chat.data[objectID].chats[chatID].offerts[0].creator.user
      .username;
  } catch (error) {
    console.warn(error);
    console.log(error, "for: ", { objectID, chatID });
  }
};

const getOffertDeciderUsername = (getState, { objectID, chatID }) => {
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

const getUserTO = (getState, { objectID, chatID }) => {
  try {
    return getState().chat.data[objectID].chats[chatID].UserTO.user.username;
  } catch (error) {
    console.warn(error);
    console.log(error, "for: ", { objectID, chatID });
  }
};

const getUser = getState => {
  try {
    return getState().auth.userData.username;
  } catch (error) {
    console.warn(error);
    console.log(error, "for: ", { objectID, chatID });
  }
};
