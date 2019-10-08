import * as actionTypes from "./actionTypes";
import uuid from "uuid";
import NetInfo from "@react-native-community/netinfo";
import { buyerChatList, loadMockNew } from "../../mockData/Chat2";
import axios from "axios";
import protectedAction from "../../utils/protectedAction";
import {
  ___CONTACT_USER___,
  ___CREATE_OFFERT___,
  ___ACCEPT_OFFERT___,
  ___REJECT_OFFERT___
} from "../constants";
import NavigationService from "../../navigator/NavigationService";
import { sendReadNotification } from "../../utils/chatUtility";
import { ChatStatus } from "../../utils/constants";

export const shoppingInit = data => ({
  type: actionTypes.SHOPPING_INIT,
  payload: {
    data
  }
});

export const shoppingStartAction = (subjectID, chatID) => ({
  type: actionTypes.SHOPPING_START_ACTION,
  payload: {
    subjectID,
    chatID
  }
});

export const shoppingStartGlobalAction = () => ({
  type: actionTypes.SHOPPING_START_GLOBAL_ACTION
});

export const shoppingFail = error => ({
  type: actionTypes.SHOPPING_FAIL,
  payload: {
    error: error
  }
});

export const shoppingSetFocus = focus => {
  return {
    type: actionTypes.SHOPPING_SET_FOCUS,
    payload: {
      focus
    }
  };
};

export const shoppingSetComposer = (subjectID, chatID, composer) => ({
  type: actionTypes.SHOPPING_SET_COMPOSER,
  payload: {
    subjectID,
    chatID,
    composer
  }
});

export const shoppingReceiveMsg = (subjectID, chatID, msg) => ({
  type: actionTypes.SHOPPING_RECEIVE_MSG,
  payload: {
    subjectID,
    chatID,
    msg
  }
});

export const shoppingConfirmMsg = (subjectID, chatID, msgID, data) => ({
  type: actionTypes.SHOPPING_CONFIRM_MSG,
  payload: {
    subjectID,
    chatID,
    msgID,
    data
  }
});

export const shoppingSendMsg = (subjectID, chatID, msg) => ({
  type: actionTypes.SHOPPING_SEND_MSG,
  payload: {
    subjectID,
    chatID,
    msg
  }
});

export const shoppingReadChat = (subjectID, chatID) => ({
  type: actionTypes.SHOPPING_READ_CHAT,
  payload: {
    subjectID,
    chatID
  }
});

export const shoppingSettleChat = (subjectID, chatID, status) => {
  return {
    type: actionTypes.SHOPPING_SETTLE_CHAT,
    payload: {
      subjectID,
      chatID,
      status
    }
  };
};

export const shoppingSetChatFocus = chatID => {
  return {
    type: actionTypes.SHOPPING_SET_CHAT_FOCUS,
    payload: {
      chatID
    }
  };
};

export const shoppingRetrieveData = data => {
  return {
    type: actionTypes.SHOPPING_RETRIEVE_DATA,
    payload: {
      data
    }
  };
};

export const shoppingLoadEarlierData = (subjectID, chatID, data) => ({
  type: actionTypes.SHOPPING_LOAD_EARLIER,
  payload: {
    subjectID,
    chatID,
    data
  }
});

export const shoppingContactUser = (item, chatID) => ({
  type: actionTypes.SHOPPING_CONTACT_USER,
  payload: {
    item,
    chatID
  }
});

export const shoppingStartStatusAction = (subjectID, chatID) => ({
  type: actionTypes.SHOPPING_START_STATUS_ACTION,
  payload: {
    subjectID,
    chatID
  }
});

export const shoppingDeleteOffert = (subjectID, chatID) => ({
  type: actionTypes.SHOPPING_REMOVE_OFFERT,
  payload: {
    subjectID,
    chatID
  }
});

export const shoppingOffertFail = (subjectID, chatID) => ({
  type: actionTypes.SHOPPING_OFFERT_FAIL,
  payload: {
    subjectID,
    chatID
  }
});

export const shoppingNewOffert = (
  subjectID,
  chatID,
  offertID,
  price,
  user
) => ({
  type: actionTypes.SHOPPING_CREATE_OFFERT,
  payload: {
    price,
    subjectID,
    chatID,
    pk: offertID,
    user
  }
});

export const shoppingClear = () => ({
  type: actionTypes.SHOPPING_CLEAR
});

export const shoppingSend = (subjectID, chatID) => {
  return (dispatch, getState) => {
    const myID = getState().auth.id;
    const content = getState().shopping.data[subjectID].chats[chatID].composer;
    const msg = createMsg(content, myID);
    dispatch(shoppingSendMsg(subjectID, chatID, msg));
    //Connection Check
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        setTimeout(
          //FAKE API ||| ADD REJECT
          () =>
            dispatch(
              shoppingConfirmMsg(subjectID, chatID, msg._id, {
                isSending: false,
                _id: uuid.v4()
              })
            ),
          2000
        );
        //ADD Reject
      } else {
        shoppingQueue.push({
          subjectID,
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
    is_read: true,
    isSending: true
  };
};

export const shoppingRead = (subjectID, chatID) => {
  return (dispatch, getState) => {
    //API TO SET READ
    const chat = getState().shopping.data[subjectID].chats[chatID];
    const hasNews = chat.hasNews;

    if (!hasNews) {
      return console.log("No News ", hasNews);
    }
    const from = chat.messages[hasNews - 1]._id;
    const to = chat.messages[0]._id;
    console.log("CHAT FROM / TO", from, to);

    dispatch(shoppingReadChat(subjectID, chatID));
    sendReadNotification(chatID, from, to);
  };
};

export const shoppingRequestContact = (subjectID, chatID, itemID) => {
  return dispatch => {
    dispatch(shoppingStartAction(subjectID, chatID));
    //API
    setTimeout(() => {
      dispatch(shoppingSettleChat(subjectID, chatID, ChatStatus.PENDING));
    }, 1000);
  };
};

shoppingQueue = [];
isShoppingResending = false;
const shoppingConnectionRestablished = () => {
  return dispatch => {
    if (!isShoppingResending) {
      isShoppingResending = true;
      dispatch(shoppingRetrySend());
    }
  };
};

const shoppingRetrySend = ({ subjectID, chatID, msg }) => {
  return dispatch => {
    //API
    setTimeout(() => {
      dispatch(
        shoppingConfirmMsg(subjectID, chatID, msg._id, {
          //Just for testing | replace with API results
          isSending: false,
          _id: uuid.v4()
        })
      );
      //shoppingQueue.splice(0, 1);
      //dispatch(shoppingRetrySend());
    }, 1000);
  };
};

export const onNewShoppingMsg = (subjectID, chatID, msg) => {
  return (dispatch, getState) => {
    const state = getState().shopping;
    if (state.chatFocus === chatID) {
      const chat = state.data[subjectID].chats[chatID];
      const from = chat.messages[chat.hasNews]._id;
      const to = msg._id;
      console.log("CHAT FROM / TO", from, to);
      sendReadNotification(chatID, from, to);
    }
    dispatch(shoppingReceiveMsg(subjectID, chatID, msg));
  };
};

export const shoppingRetrieve = () => {
  return dispatch => {
    dispatch(shoppingStartGlobalAction());
    //API
    setTimeout(() => {
      dispatch(shoppingRetrieveData(buyerChatList));
    }, 2000);
  };
};

export const shoppingLoadEarlier = (subjectID, chatID) => {
  return dispatch => {
    dispatch(shoppingStartAction(subjectID, chatID));
    //API
    setTimeout(() => {
      dispatch(shoppingLoadEarlierData(subjectID, chatID, loadMockNew()));
    }, 2000);
  };
};

export const shoppingContact = item => {
  return dispatch => {
    protectedAction()
      .then(token => {
        axios
          .post(___CONTACT_USER___, {
            item: item.pk
          })
          .then(res => {
            console.log(res);
            dispatch(shoppingContactUser(res.data.item, res.data._id));
            NavigationService.navigate("ShoppingChat", {
              chatID: res.data._id,
              subjectID: res.data.item.book.subject._id
            });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(() => null);
    /*
    dispatch(shoppingContactUser(item, chatID));
    NavigationService.navigate("ShoppingChat", {
      chatID,
      subjectID: item.book.subject._id
    });*/
  };
};

export const shoppingRestart = data => {
  return dispatch => {
    while (shoppingQueue.length !== 0) {
      const item = shoppingQueue.shift();
      dispatch(shoppingRetrySend(item));
    }

    dispatch(shoppingStartGlobalAction());

    setTimeout(() => {
      dispatch(shoppingRetrieveData(data));
    }, 2000);
  };
};

export const shoppingCreateOffert = (subjectID, chatID, price) => {
  return (dispatch, getState) => {
    dispatch(shoppingStartStatusAction(subjectID, chatID));

    //API
    axios
      .post(___CREATE_OFFERT___, {
        offert: price,
        chat: chatID
      })
      .then(res => {
        console.log(res);
        const { username, id } = getState().auth;
        dispatch(
          shoppingNewOffert(subjectID, chatID, res.data.pk, price, {
            _id: id,
            user: {
              username
            }
          })
        );
      })
      .catch(err => {
        console.log({ err });
        dispatch(shoppingOffertFail(subjectID, chatID));
      });
  };
};

export const shoppingRemoveOffert = (subjectID, chatID) => {
  return dispatch => {
    dispatch(shoppingStartStatusAction(subjectID, chatID));

    //API
    setTimeout(() => {
      dispatch(shoppingDeleteOffert(subjectID, chatID));
    }, 2000);
  };
};

export const shoppingRejectOffert = (subjectID, chatID) => {
  return (dispatch, getState) => {
    dispatch(shoppingStartStatusAction(subjectID, chatID));
    console.log(getState().shopping.data[subjectID].chats[chatID].offerts[0]);
    offertID = getState().shopping.data[subjectID].chats[chatID].offerts[0]._id;
    console.log(offertID);

    axios
      .post(___REJECT_OFFERT___, {
        offert: offertID
      })
      .then(res => {
        console.log(res);
        dispatch({
          type: actionTypes.SHOPPING_REMOVE_OFFERT,
          payload: {
            subjectID,
            chatID
          }
        });
      })
      .catch(err => {
        console.log({ err });
        dispatch(shoppingOffertFail(subjectID, chatID));
      });
  };
};

export const shoppingAcceptOffert = (subjectID, chatID) => {
  return (dispatch, getState) => {
    dispatch(shoppingStartStatusAction(subjectID, chatID));

    offertID = getState().shopping.data[subjectID].chats[chatID].offerts[0]._id;
    console.log(offertID);

    axios
      .post(___ACCEPT_OFFERT___, {
        offert: offertID
      })
      .then(res => {
        console.log(res);
        dispatch({
          type: actionTypes.SHOPPING_ACCEPT_OFFERT,
          payload: {
            subjectID,
            chatID
          }
        });
      })
      .catch(err => {
        console.log({ err });
        dispatch(shoppingOffertFail(subjectID, chatID));
      });
  };
};
