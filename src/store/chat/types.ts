import { GeneralUser } from "../../types/ProfileTypes";
import { GeneralItem } from "../../types/ItemTypes";

export interface ChatStructure {
  data: ChatDataType;
  chatOrder: string[];
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

export type ChatDataType = { [key: string]: ChatType };

export interface ChatType {
  id: string;
  messages: GeneralMessage[];
  users: ChatUser[];
  createdAt: string | Date;
  status: ChatStatus;
  items: GeneralItem[];
  //seller: GeneralUser;
  //buyer: GeneralUser;
  //blocked: boolean;

  composer: string;
  receiver: ChatUser;
  //type: ChatClass;
}

interface BasicMessage {
  id: number;
  text: string;
  createdAt: string | Date;

  //is_read: boolean;
  isSending?: boolean;
  error?: any;
}

export interface ChatUser {
  user: {
    id: number;
    username: string;
  };
  news: number;
}

interface UserMessage extends BasicMessage {
  sender: ChatUser;
}

interface SystemMessage extends BasicMessage {
  system: boolean;
}

export type GeneralMessage = UserMessage | SystemMessage;

export enum ChatClass {
  SALES = "sales",
  SHOPPING = "shopping"
}

export enum ChatStatus {
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
