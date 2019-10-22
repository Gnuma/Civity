import { GeneralUser } from "../../types/ProfileTypes";
import { GeneralItem } from "../../types/ItemTypes";

export interface ChatType {}

export const CHAT_INIT = "CHAT_INIT";

export interface ChatDisableItem {
  type: typeof CHAT_INIT;
}

export type TChatActions = ChatDisableItem;

interface MockChatType {
  data: {
    [key: string]: {
      _id: string;
      seller: GeneralUser;
      buyer: GeneralUser;

      blocked: boolean;
      status: ChatStatus;
      news: number;

      messages: GeneralMessage[];
      composer: string;

      type: ChatClass;

      items: GeneralItem[];
    };
  };
}

interface BasicMessage {
  _id: number;
  createdAt: string | Date;
  is_read: boolean;
  text: string;
  isSending?: boolean;
  error?: any;
}

interface UserMessage extends BasicMessage {
  user: {
    _id: number;
    username: string;
  };
}

interface SystemMessage extends BasicMessage {
  system: boolean;
}

type GeneralMessage = UserMessage | SystemMessage;

enum ChatClass {
  SALES = "sales",
  SHOPPING = "shopping"
}

enum ChatStatus {
  LOCAL = "local", // #frontend
  PENDING = "pending",
  PROGRESS = "progress",

  BLOCKED = "blocked",
  COMPLETED = "completed"
}
