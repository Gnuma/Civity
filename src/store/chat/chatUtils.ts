import {
  ChatDataType,
  ChatType,
  ChatStatus,
  ChatUser,
  GeneralMessage
} from "./types";
import { GeneralItem } from "../../types/ItemTypes";

export const findChatIDFromUserID = (
  id: number,
  chatOrder: string[],
  data: ChatDataType
): string | null => {
  for (let i = 0; i < chatOrder.length; i++)
    if (data[chatOrder[i]].receiver.user.id == id) return chatOrder[i];
  return null;
};

export const createChat = (
  chatID: string,
  item: GeneralItem,
  user: ChatUser
): ChatType => ({
  composer: "",
  createdAt: new Date(),
  id: chatID,
  items: [],
  messages: [],
  receiver: { news: 0, user: { id: 0, username: "TODO" } }, //TODO
  status: ChatStatus.LOCAL,
  users: [{ news: 0, user: { id: 0, username: "TODO" } }, user] //TODO
});

export const createMessage = (
  text: string,
  messageID: number,
  user: ChatUser
): GeneralMessage => ({
  createdAt: new Date(),
  id: messageID,
  text: text,
  isSending: true,
  sender: user
});

export const findMessageIndexFromId = (
  messages: GeneralMessage[],
  messageID: number
) => messages.findIndex(m => m.id === messageID);
