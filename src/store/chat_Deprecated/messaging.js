import NetInfo from "@react-native-community/netinfo";
import uuid from "uuid";
import { chatConfirmMsg, chatSendMsg } from "./";
import axios from "axios";
import { ___SEND_MESSAGE___ } from "../endpoints";

let queue = [];

export const sendMessage = (type, objectID, chatID) => {
  return (dispatch, getState) => {
    const myID = getState().auth.id;
    const content = getState().chat.data[objectID].chats[chatID].composer;
    const msg = createMsg(content, myID);

    console.log(type, objectID, chatID);
    dispatch(chatSendMsg(objectID, chatID, msg, type));
    //Connection check
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        //API
        axios
          .post(___SEND_MESSAGE___, {
            chat: chatID,
            content: content
          })
          .then(res => {
            console.log(res);
            dispatch(
              chatConfirmMsg(objectID, chatID, msg._id, {
                isSending: false,
                _id: uuid.v4()
              })
            );
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        queue.push({
          objectID,
          chatID,
          msg
        });
      }
    });
  };
};

export const messagingClear = () => (queue = []);

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
