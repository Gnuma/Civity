import uuid from "uuid";
import { OffertStatus } from "../utils/constants";
import { ___READ_CHAT___ } from "../store/constants";
import axios from "axios";

export const getSubjectIndex = (subjectID, orderedData) => {
  console.log(orderedData, subjectID);
  for (let i = 0; i < orderedData.length; i++) {
    console.log(orderedData[i].subjectID, subjectID);
    if (orderedData[i].subjectID == subjectID) return i;
  }
  return -1;
};

export const getItemIndex = (itemID, orderedData) => {
  for (let i = 0; i < orderedData.length; i++) {
    if (orderedData[i].itemID == itemID) return i;
  }
  return -1;
};

export const getChatIndex = (chatID, item) => {
  for (let i = 0; i < item.chats.length; i++) {
    if (item.chats[i] == chatID) return i;
  }
  return -1;
};

export const highlightItem = (array, index) =>
  array.splice(index, 1).concat(array);

export const createOffert = (user, price, pk) => ({
  creator: user,
  createdAt: new Date(),
  value: price,
  status: OffertStatus.PENDING,
  _id: pk
});

export const createSystemMessage = text => ({
  createdAt: new Date(),
  _id: uuid.v4(),
  text,
  system: true,
  is_read: false
});

export const sendReadNotification = (chat, from, to) => {
  axios
    .post(___READ_CHAT___, {
      chat,
      from,
      to
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log({ err });
    });
};
