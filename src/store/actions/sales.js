import * as actionTypes from "./actionTypes";
import ws from "../../utils/WebSocket";
import uuid from "uuid";
import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";
import { sellerChatList, loadMockNew } from "../../mockData/Chat2";
import axios from "axios";
import {
  ___CREATE_OFFERT___,
  ___REJECT_OFFERT___,
  ___ACCEPT_OFFERT___,
  ___READ_CHAT___
} from "../constants";
import { sendReadNotification } from "../../utils/chatUtility";
import { ChatStatus } from "../../utils/constants";

export const salesInit = data => {
  return {
    type: actionTypes.SALES_INIT,
    payload: {
      data
    }
  };
};

export const salesStartAction = (itemID, chatID) => {
  return {
    type: actionTypes.SALES_START_ACTION,
    payload: {
      itemID,
      chatID
    }
  };
};

export const salesStartGlobalAction = () => ({
  type: actionTypes.SALES_START_GLOBAL_ACTION
});

export const salesFail = error => {
  return {
    type: actionTypes.SALES_FAIL,
    payload: {
      error: error
    }
  };
};

export const salesSetFocus = focus => {
  return {
    type: actionTypes.SALES_SET_FOCUS,
    payload: {
      focus
    }
  };
};

export const salesSetComposer = (itemID, chatID, composer) => {
  return {
    type: actionTypes.SALES_SET_COMPOSER,
    payload: {
      itemID,
      chatID,
      composer
    }
  };
};

export const salesReceiveMsg = (item, chat, msg) => {
  return {
    type: actionTypes.SALES_RECEIVE_MSG,
    payload: {
      item,
      chat,
      msg
    }
  };
};

export const salesConfirmMsg = (itemID, chatID, msgID, data) => {
  return {
    type: actionTypes.SALES_CONFIRM_MSG,
    payload: {
      itemID,
      chatID,
      msgID,
      data
    }
  };
};

export const salesSendMsg = (itemID, chatID, msg) => {
  return {
    type: actionTypes.SALES_SEND_MSG,
    payload: {
      itemID,
      chatID,
      msg
    }
  };
};

export const salesReadChat = (itemID, chatID) => {
  return {
    type: actionTypes.SALES_READ_CHAT,
    payload: {
      itemID,
      chatID
    }
  };
};

export const salesSettleChat = (itemID, chatID, status) => {
  return {
    type: actionTypes.SALES_SETTLE_CHAT,
    payload: {
      itemID,
      chatID,
      status
    }
  };
};

export const salesSetChatFocus = chatID => {
  return {
    type: actionTypes.SALES_SET_CHAT_FOCUS,
    payload: {
      chatID
    }
  };
};

export const salesRetrieveData = data => {
  return {
    type: actionTypes.SALES_RETRIEVE_DATA,
    payload: {
      data
    }
  };
};

export const salesLoadEarlierData = (itemID, chatID, data) => ({
  type: actionTypes.SALES_LOAD_EARLIER,
  payload: {
    itemID,
    chatID,
    data
  }
});

export const salesNewChat = (itemID, chatID, data) => ({
  type: actionTypes.SALES_NEW_CHAT,
  payload: {
    itemID,
    chatID,
    data
  }
});

export const salesStartStatusAction = (itemID, chatID) => ({
  type: actionTypes.SALES_START_STATUS_ACTION,
  payload: {
    itemID,
    chatID
  }
});

export const salesDeleteOffert = (itemID, chatID) => ({
  type: actionTypes.SALES_REMOVE_OFFERT,
  payload: {
    itemID,
    chatID
  }
});

export const salesOffertFail = (itemID, chatID) => ({
  type: actionTypes.SALES_OFFERT_FAIL,
  payload: {
    itemID,
    chatID
  }
});

export const salesNewOffert = (itemID, chatID, offertID, price, user) => ({
  type: actionTypes.SALES_CREATE_OFFERT,
  payload: {
    price,
    itemID,
    chatID,
    pk: offertID,
    user
  }
});

export const salesClear = () => ({
  type: actionTypes.SALES_CLEAR
});

export const salesSend = (itemID, chatID) => {
  return (dispatch, getState) => {
    const myID = getState().auth.id;
    const content = getState().sales.data[itemID].chats[chatID].composer;
    const msg = createMsg(content, myID);
    dispatch(salesSendMsg(itemID, chatID, msg));

    //Connection CHECK
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        setTimeout(
          //FAKE API ||| ADD REJECT
          () =>
            dispatch(
              salesConfirmMsg(itemID, chatID, msg._id, {
                isSending: false,
                _id: uuid.v4()
              })
            ),
          2000
        );
        //ADD Reject
      } else {
        saleQueue.push({
          itemID,
          chatID,
          msg
        });
      }
    });
  };
};

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

export const salesRead = (itemID, chatID) => {
  return (dispatch, getState) => {
    //API to set read (TO-DO)
    const chat = getState().sales.data[itemID].chats[chatID];
    const hasNews = chat.hasNews;
    if (!hasNews) {
      return console.log("No News ", hasNews);
    }

    const from = chat.messages[hasNews - 1]._id;
    const to = chat.messages[0]._id;
    console.log("CHAT FROM / TO", from, to);

    dispatch(salesReadChat(itemID, chatID));
    sendReadNotification(chatID, from, to);
  };
};

export const salesSettle = (itemID, chatID, isAccepting) => {
  return dispatch => {
    dispatch(salesStartAction(itemID, chatID));
    //API
    setTimeout(() => {
      if (isAccepting) {
        dispatch(salesSettleChat(itemID, chatID, ChatStatus.PROGRESS));
      } else {
        dispatch(salesSettleChat(itemID, chatID, ChatStatus.REJECTED));
      }
    }, 1000);
  };
};

saleQueue = [];
isSaleResending = false;
const salesConnectionRestablished = () => {
  return dispatch => {
    if (!isSaleResending) {
      isSaleResending = true;
      dispatch(salesRetrySend());
    }
  };
};

const salesRetrySend = ({ itemID, chatID, msg }) => {
  return dispatch => {
    //API
    setTimeout(() => {
      dispatch(
        salesConfirmMsg(itemID, chatID, msg._id, {
          //Just for testing | replace with API results
          isSending: false,
          _id: uuid.v4()
        })
      );
    }, 1000);
  };
};

export const onNewSalesMsg = (itemID, chatID, msg) => {
  return (dispatch, getState) => {
    //Gotta have this sequentially
    const state = getState().sales;
    if (state.chatFocus === chatID) {
      const chat = state.data[itemID].chats[chatID];
      const from = chat.messages[chat.hasNews]._id;
      const to = msg._id;
      console.log("CHAT FROM / TO", from, to);
      sendReadNotification(chatID, from, to);
    }
    dispatch(salesReceiveMsg(itemID, chatID, msg));
  };
};

export const salesRetrieve = () => {
  return dispatch => {
    dispatch(salesStartGlobalAction());
    //API
    setTimeout(() => {
      dispatch(salesRetrieveData(sellerChatList));
    }, 2000);
  };
};

export const salesLoadEarlier = (itemID, chatID) => {
  return dispatch => {
    dispatch(salesStartAction(itemID, chatID));
    //API
    setTimeout(() => {
      dispatch(salesLoadEarlierData(itemID, chatID, loadMockNew()));
    }, 2000);
  };
};

export const salesRestart = data => {
  return dispatch => {
    while (saleQueue.length !== 0) {
      const item = saleQueue.shift();
      dispatch(salesRetrySend(item));
    }

    dispatch(salesStartGlobalAction());

    setTimeout(() => {
      dispatch(salesRetrieveData(data));
    }, 2000);
  };
};

export const salesCreateOffert = (itemID, chatID, price) => {
  return (dispatch, getState) => {
    dispatch(salesStartStatusAction(itemID, chatID));

    axios
      .post(___CREATE_OFFERT___, {
        offert: price,
        chat: chatID
      })
      .then(res => {
        console.log(res);
        const { username, id } = getState().auth;
        dispatch(
          salesNewOffert(itemID, chatID, res.data.pk, price, {
            _id: id,
            user: {
              username
            }
          })
        );
      })
      .catch(err => {
        console.log({ err });
        dispatch(salesOffertFail(itemID, chatID));
      });
  };
};

export const salesRemoveOffert = (itemID, chatID) => {
  return dispatch => {
    dispatch(salesStartStatusAction(itemID, chatID));

    //API
    setTimeout(() => {
      dispatch(salesDeleteOffert(itemID, chatID));
    }, 2000);
  };
};

export const salesRejectOffert = (itemID, chatID) => {
  return (dispatch, getState) => {
    dispatch(salesStartStatusAction(itemID, chatID));

    offertID = getState().sales.data[itemID].chats[chatID].offerts[0]._id;

    axios
      .post(___REJECT_OFFERT___, {
        offert: offertID
      })
      .then(res => {
        console.log(res);
        dispatch({
          type: actionTypes.SALES_REMOVE_OFFERT,
          payload: {
            itemID,
            chatID
          }
        });
      })
      .catch(err => {
        console.log({ err });
        dispatch(salesOffertFail(itemID, chatID));
      });
  };
};

export const salesAcceptOffert = (itemID, chatID) => {
  return (dispatch, getState) => {
    dispatch(salesStartStatusAction(itemID, chatID));

    offertID = getState().sales.data[itemID].chats[chatID].offerts[0]._id;

    axios
      .post(___ACCEPT_OFFERT___, {
        offert: offertID
      })
      .then(res => {
        console.log(res);
        dispatch({
          type: actionTypes.SALES_ACCEPT_OFFERT,
          payload: {
            itemID,
            chatID
          }
        });
      })
      .catch(err => {
        console.log({ err });
        dispatch(salesOffertFail(itemID, chatID));
      });
  };
};
