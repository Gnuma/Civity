import { GeneralUser } from "../../types/ProfileTypes";
import { GeneralItem } from "../../types/ItemTypes";

export interface ChatType {
  data: ChatDataType;
  error?: unknown;
  state: ChatState;
}

export const CHAT_CONNECT = "CHAT_CONNECT";
export const CHAT_DISCONNECT = "CHAT_DISCONNECT";
export const CHAT_SOCKET_MSG = "CHAT_SOCKET_MSG";
export const CHAT_BUFFER = "CHAT_BUFFER";
export const CHAT_FAIL = "CHAT_FAIL";
export const CHAT_RESUME = "CHAT_RESUME";

export enum ChatState {
  DISCONNECTED = "DISCONNECTED",
  BUFFER = "BUFFER",
  CONNECTED = "CONNECTED"
}

export type ChatDataType = { [key: number]: MockChatType };

interface MockChatType {
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

export interface ChatConnectAction {
  type: typeof CHAT_CONNECT;
}

export interface ChatDisconnectAction {
  type: typeof CHAT_DISCONNECT;
}

export interface ChatBufferAction {
  type: typeof CHAT_BUFFER;
}

export interface ChatSocketMsgAction {
  type: typeof CHAT_SOCKET_MSG;
  payload: unknown;
}

export interface ChatFailAction {
  type: typeof CHAT_FAIL;
  payload: {
    error: unknown;
  };
}

export interface ResumeMessages {
  id: number;
  messages: GeneralMessage[];
}

export interface ChatResumeAction {
  type: typeof CHAT_RESUME;
  payload: {
    data: ResumeMessages[];
  };
}

export type TChatActions =
  | ChatConnectAction
  | ChatDisconnectAction
  | ChatBufferAction
  | ChatSocketMsgAction
  | ChatFailAction
  | ChatResumeAction;
