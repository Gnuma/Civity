import { GeneralUser } from "../../types/ProfileTypes";
import { GeneralItem } from "../../types/ItemTypes";

export interface ChatStructure {
  data: ChatDataType;
  chatOrder: string[];
  error?: unknown;
  state: ChatState;
  chatFocus: string | null;
}

export const CHAT_CONNECT = "CHAT_CONNECT";
export const CHAT_DISCONNECT = "CHAT_DISCONNECT";
export const CHAT_SOCKET_MSG = "CHAT_SOCKET_MSG";
export const CHAT_BUFFER = "CHAT_BUFFER";
export const CHAT_FAIL = "CHAT_FAIL";
export const CHAT_RESUME = "CHAT_RESUME";
export const CHAT_SAVE_COMPOSER = "CHAT_SAVE_COMPOSER";
export const CHAT_SET_FOCUS = "CHAT_SET_FOCUS";

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

export interface BasicMessage {
  id: number;
  text: string;
  createdAt: string | Date;
  attachment?: GenericAttachment;

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

export interface UserMessage extends BasicMessage {
  sender: ChatUser;
}

export interface SystemMessage extends BasicMessage {
  system: boolean;
}

export interface GeneralMessage extends BasicMessage {
  sender?: ChatUser;
  system?: boolean;
}

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

export enum AttachmentType {
  IMAGE = "IMAGE",
  ITEM = "ITEM"
  //AUDIO = "AUDIO",
  //VIDEO = "VIDEO"
}

export interface ImageAttachment {
  type: typeof AttachmentType.IMAGE;
  url: string;
}

export interface ItemAttachment {
  type: typeof AttachmentType.ITEM;
  item: GeneralItem;
  buyer: ChatUser;
}
/*
export interface AudioAttachment {
  type: typeof AttachmentType.AUDIO;
  id: string;
  url: string;
}
*/

/*
export interface BasicAudio {
  id: string;
  url: string;
  isPaused: boolean;
}
*/

/*
export interface VideoAttachment {
  type: typeof AttachmentType.VIDEO;
  url: string;
}
*/

export type GenericAttachment = ImageAttachment | ItemAttachment;
//| AudioAttachment
//| VideoAttachment;

/*
export interface AudioPlayer {
  playAudio: (audio: AudioAttachment) => void;
  pauseAudio: () => void;
  focusedAudio?: BasicAudio;
  time: number;
}
*/

/**
 * Actions
 */

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

export interface ChatSaveComposer {
  type: typeof CHAT_SAVE_COMPOSER;
  payload: {
    composer: string;
    id: string;
  };
}

export interface ChatSetFocus {
  type: typeof CHAT_SET_FOCUS;
  payload: {
    id: string | null;
  };
}

export type TChatActions =
  | ChatConnectAction
  | ChatDisconnectAction
  | ChatBufferAction
  | ChatSocketMsgAction
  | ChatFailAction
  | ChatResumeAction
  | ChatSaveComposer
  | ChatSetFocus;
