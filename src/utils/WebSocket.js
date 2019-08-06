import {
  ___WS_ENDPOINT___,
  ___WS_TEST_ENDPOINT,
  ___RETRIEVE_CHATS___
} from "../store/constants";
import { ToastAndroid } from "react-native";
//import "./MockWS";
import store from "../store/store";
import { authCompleted, authFail } from "../store/actions/auth";
import update from "immutability-helper";
import { commentList } from "../mockData/comments";
import {
  sellerChatList,
  buyerChatList,
  buyerChatList_DEPRECATED
} from "../mockData/Chat2";
import {
  commentsReceiveComment,
  commentsInit,
  commentsReceiveAnswer
} from "../store/actions/comments";
import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";
import { ChatType, ChatStatus } from "./constants";
import { restart } from "../store/actions/messaging";
import axios from "axios";
import {
  chatInit,
  chatNewChat,
  chatReceiveMessage,
  chatNewOffert,
  chatOnline,
  chatRemoveOffert,
  chatSetOffertAccepted,
  chatSettleAction,
  chatSetFeedback,
  chatBlockChat,
  chatDisableItem
} from "../store/actions/chat";

class WS {
  ws = null;
  token = null;

  connectionSubscription = null;
  stateSubscription = null;
  lastAppState = null;
  lastConnectionState = null;

  retries = 0;

  init(token, resolve) {
    console.log("Initiating WS...");
    this.token = token;
    this.retries = 5;

    this.connectionSubscription = NetInfo.isConnected.addEventListener(
      "connectionChange",
      isConnected => {
        if (isConnected && this.ws) store.dispatch(chatOnline());
      }
    );

    axios
      .get(___RETRIEVE_CHATS___)
      .then(res => {
        console.log(res);
        store.dispatch(chatInit(res.data.sales, res.data.shopping));
        store.dispatch(authCompleted());
        this.startConnection();

        resolve({ token, isActive: true });
      })
      .catch(err => {
        store.dispatch(authFail(err));
        resolve({ token, isActive: true });
      });
  }

  restart = isConnected => {
    if (!isConnected) return;
    //this.refresh().then(this.startConnection);
  };

  refresh = () => {
    return new Promise(function(resolve, reject) {
      store.dispatch(restart(resolve));
    });
  };

  onMessage = msg => {
    try {
      let data = JSON.parse(msg.data);
      console.log(data);
      switch (data.type) {
        case DataType.NEW_CHAT:
          return store.dispatch(
            chatNewChat(data.chat.item.pk, data.chat._id, data.chat)
          );

        case DataType.NEW_MESSAGE:
          const msg = formatMsg(data.message);
          return store.dispatch(
            chatReceiveMessage(
              (data.for === "sale" ? "" : "s") + data.objectID,
              data.chatID, //_id
              msg,
              data.for
            )
          );

        case DataType.NEW_COMMENT:
          return store.dispatch(commentsReceiveComment(data.comment));

        case DataType.NEW_ANSWER:
          return store.dispatch(commentsReceiveAnswer(data.answer));

        case DataType.RETRIEVE_NOTIFICATIONS:
          return store.dispatch(commentsInit(data.notifications));

        case DataType.NEW_OFFERT:
          return store.dispatch(
            chatNewOffert(
              (data.for === "sale" ? "" : "s") + data._id,
              data.offert.chat,
              data.offert.id,
              data.offert.offert
            )
          );

        case DataType.ACCEPTED_CHAT:
          return store.dispatch(
            chatSettleAction("s" + data.objectID, data._id, ChatStatus.PROGRESS)
          );

        case DataType.REJECTED_CHAT:
          return store.dispatch(
            chatSettleAction("s" + data.objectID, data._id, ChatStatus.REJECTED)
          );

        case DataType.ACCEPTED_OFFERT:
          return store.dispatch(
            chatSetOffertAccepted(
              (data.for === "sale" ? "" : "s") + data.objectID,
              data._id
            )
          );

        case DataType.REJECTED_OFFERT:
          return store.dispatch(
            chatRemoveOffert(
              (data.for === "sale" ? "" : "s") + data.objectID,
              data._id,
              true
            )
          );

        case DataType.CANCEL_OFFERT:
          return store.dispatch(
            chatRemoveOffert(
              (data.for === "sale" ? "" : "s") + data.objectID,
              data._id,
              false
            )
          );

        case DataType.FEEDBACK_CHAT:
          return store.dispatch(
            chatSetFeedback(
              (data.for === "sale" ? "" : "s") + data.objectID,
              data._id,
              data.feedback.judgment,
              data.feedback.comment,
              true
            )
          );

        case DataType.COMPLETE_CHAT:
          return store.dispatch(
            chatSettleAction(
              (data.for === "sale" ? "" : "s") + data.objectID,
              data._id,
              ChatStatus.FEEDBACK
            )
          );

        case DataType.ITEM_BLOCKED:
          store.dispatch(
            chatSettleAction("s" + data.objectID, data._id, ChatStatus.BLOCKED)
          );
          return store.dispatch(
            chatDisableItem(ChatType.sales, "s" + data.objectID, data._id)
          );

        default:
          throw `Type ${data.type} not valid`;
      }
    } catch (error) {
      console.warn(error);
    }
  };

  startConnection = () => {
    console.log(
      "Connecting to WS Server... -> " +
        ___WS_ENDPOINT___ +
        "?token=" +
        this.token
    );
    this.ws = new WebSocket(___WS_ENDPOINT___ + "?token=" + this.token);
    //this.ws = new WebSocket(___WS_TEST_ENDPOINT);
    this.ws.onopen = this.onOpen;
    this.ws.onclose = this.onClose;
    this.ws.onerror = this.onError;
    this.ws.onmessage = this.onMessage;
  };

  close = () => {
    if (this.ws) {
      console.log("Closing connection...");
      this.retries = -1;
      try {
        this.ws.close();
        //this.connectionSubscription.remove();
      } catch (error) {
        //console.warn(error);
      }
    }
  };

  sendMessage(message) {
    this.ws.send(message);
  }

  onOpen = () => {
    this.retries = 5;
    console.log("Connected");
    ToastAndroid.show("Connected", ToastAndroid.SHORT);
  };

  onClose = code => {
    //console.log("Closing: ", code);
    //console.log(this.retries);
    if (this.retries > 0) {
      console.log("Restarting...");
      setTimeout(this.startConnection, 500);
      this.retries--;
    } else if (this.retries == 0) {
      console.log("Restarting in 5 sec");
      setTimeout(this.startConnection, 5000);
      ToastAndroid.show("Disconnected", ToastAndroid.SHORT);
    } else {
      console.log("Closed");
      ToastAndroid.show("Logout", ToastAndroid.SHORT);
    }
  };

  onError = err => {
    //console.warn(err);
    console.log(this.retries);
  };
}

const DataType = {
  NEW_MESSAGE: "newMessage",
  NEW_CHAT: "newChat",
  NEW_COMMENT: "newComment",
  NEW_ANSWER: "newAnswer",
  RETRIEVE_NOTIFICATIONS: "retrieveNotifications",
  NEW_OFFERT: "newOffert",
  ACCEPTED_CHAT: "acceptChat",
  REJECTED_CHAT: "rejectChat",
  ACCEPTED_OFFERT: "acceptOffert",
  REJECTED_OFFERT: "rejectOffert",
  CANCEL_OFFERT: "deleteOffert",
  FEEDBACK_CHAT: "feedbackChat",
  COMPLETE_CHAT: "completeChat",
  ITEM_BLOCKED: "itemBlocked"
};

formatMsg = msg => {
  return update(msg, {
    createdAt: {
      $apply: dateStr => new Date(dateStr)
    }
  });
};

export default new WS();
