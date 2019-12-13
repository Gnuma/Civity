import { ChatDataType, ChatType, ChatStatus, ChatUser } from "./types";
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
