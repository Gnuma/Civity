import {
  BasicUser,
  GeneralUser,
  UserSerializer,
  UsernameSerializer
} from "../../types/ProfileTypes";
import {
  GeneralItem,
  GeneralBook,
  ItemCondition,
  GeneralSubject,
  ReducedItem,
  BasicItem
} from "../../types/ItemTypes";

export const CHAT_INIT = "CHAT_INIT";
export const CHAT_CLEAR = "CHAT_CLEAR";
export const CHAT_START_CHAT_ACTION = "CHAT_START_CHAT_ACTION";
export const CHAT_START_GLOBAL_ACTION = "CHAT_START_GLOBAL_ACTION";
export const CHAT_FAIL = "CHAT_FAIL";
export const CHAT_SINGLE_FAIL = "CHAT_SINGLE_FAIL";
export const CHAT_SET_SALES_LIST_FOCUS = "CHAT_SET_SALES_LIST_FOCUS";
export const CHAT_SET_SHOPPING_LIST_FOCUS = "CHAT_SET_SHOPPING_LIST_FOCUS";
export const CHAT_SET_CHAT_FOCUS = "CHAT_SET_CHAT_FOCUS";
export const CHAT_SET_COMPOSER = "CHAT_SET_COMPOSER";
export const CHAT_RECEIVE_MSG = "CHAT_RECEIVE_MSG";
export const CHAT_SEND_MSG = "CHAT_SEND_MSG";
export const CHAT_SYSTEM_MSG = "CHAT_SYSTEM_MSG";
export const CHAT_CONFIRM_MSG = "CHAT_CONFIRM_MSG";
export const CHAT_ERROR_MSG = "CHAT_ERROR_MSG";
export const CHAT_READ = "CHAT_READ";
export const CHAT_SETTLE = "CHAT_SETTLE";
export const CHAT_LOAD_EARLIER = "CHAT_LOAD_EARLIER";
export const CHAT_CONTACT_USER = "CHAT_CONTACT_USER";
export const CHAT_NEW_ITEM = "CHAT_NEW_ITEM";
export const CHAT_MODIFY_ITEM = "CHAT_MODIFY_ITEM";
export const CHAT_NEW_CHAT = "CHAT_NEW_CHAT";
export const CHAT_START_STATUS_ACTION = "CHAT_START_STATUS_ACTION";
export const CHAT_NEW_OFFERT = "CHAT_NEW_OFFERT";
export const CHAT_REMOVE_OFFERT = "CHAT_REMOVE_OFFERT";
export const CHAT_ACCEPT_OFFERT = "CHAT_ACCEPT_OFFERT";
export const CHAT_OFFERT_FAIL = "CHAT_OFFERT_FAIL";
export const CHAT_ONLINE = "CHAT_ONLINE";
export const CHAT_SET_FEEDBACK = "CHAT_SET_FEEDBACK";
export const CHAT_DISABLE_ITEM = "CHAT_DISABLE_ITEM";

export interface ChatType {
  data: { [key: string]: SalesData | ShoppingData }; // Todo
  salesOrderedData: Array<OrderedSalesData>; //Todo
  shoppingOrderedData: Array<OrderedShoppingData>;
  contactedItems: { [key: number]: boolean }; //Todo
  error: unknown;
  salesFocus: ChatCategoryIdType;
  shoppingFocus: ChatCategoryIdType;
  chatFocus: number;
  loading: boolean;
}

export type ChatCategoryIdType = string | number;

export enum ChatCategoryType {
  shopping = "shopping",
  sales = "sales"
}

export enum ChatCategorySecondaryType {
  shopping = "shopping",
  sale = "sale"
}

export enum ChatStatus {
  LOCAL = 0,
  PENDING = 1,
  PROGRESS = 2,
  EXCHANGE = 3,
  FEEDBACK = 4,
  COMPLETED = 5,
  REJECTED = 6,
  BLOCKED = 7
}

export enum OffertStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2
}

export enum FEEDBACK_TYPES {
  POSITIVE = 1,
  NEGATIVE = 0
}

export enum TextFeedbackTypes {
  Negativo,
  Positivo
}

export interface OrderedShoppingData {
  subjectID: ChatCategoryIdType;
  chats: number[];
}

export interface OrderedSalesData {
  itemID: ChatCategoryIdType;
  chats: number[];
}

export interface ChatIdentifierPayload {
  objectID: ChatCategoryIdType;
  chatID: number;
}

export interface ShoppingData {
  _id: string;
  title: string;
  newsCount: number;
  chats: {
    [key: number]: ShoppingChat;
  };
}

export interface SalesData {
  _id: ChatCategoryIdType;
  seller: GeneralUser;
  book: GeneralBook;
  newsCount: number;
  price: number;
  condition: ItemCondition;
  image_ad: string[];
  enabled: boolean;
  chats: { [key: number]: GeneralChat };
}

export interface GeneralChat {
  _id: number;
  UserTO: GeneralUser;
  hasNews: number;
  status: ChatStatus;
  statusLoading?: boolean;
  messages: GeneralMessage[];
  offerts: GeneralOffert[];
  toload: boolean;
  feedbacks: {
    buyer?: GeneralFeedback;
    seller?: GeneralFeedback;
  };
  composer: string;
  loading: boolean;
}

export interface ShoppingChat extends GeneralChat {
  item: GeneralItem;
  buyer: UserSerializer;
}

export interface GeneralMessage {
  _id: number | string;
  createdAt: string | Date;
  is_read: boolean;
  text: string;
  user?: {
    _id: number;
    username?: string;
  };
  system?: boolean;
  isSending?: boolean;
  error?: any;
}

export interface GeneralOffert {
  creator: {
    _id: number;
    user: UsernameSerializer;
  };
  createdAt: string;
  value: string;
  status: OffertStatus;
  _id: number;
}

export interface GeneralFeedback {
  _id: number;
  is_buyer: boolean;
  judgment: FEEDBACK_TYPES;
  comment: string;
  chat: number;
}

export interface SalesChatItem extends ReducedItem {
  price: number;
  condition: ItemCondition;
}

export interface ChatSerializer {
  _id: number;
  item: SalesChatItem;
  buyer: UserSerializer;
  createdAt: string;
}

export interface ChatInitSerializer {
  buyer: UserSerializer;
  feedbacks: {
    buyer?: GeneralFeedback;
    seller?: GeneralFeedback;
  };
  hasNews: number;
  messages: GeneralMessage[];
  offerts: GeneralOffert[];
  status: number;
  toload: boolean;
  _id: number;
}

export interface InitChatItemSerializer {
  book: GeneralBook;
  condition: ItemCondition;
  enabled: boolean;
  image_ad: [];
  newsCount: number;
  price: number;
  seller: UserSerializer;
  _id: number;
}

export interface InitSalesType extends InitChatItemSerializer {
  chats: ChatInitSerializer[];
}

export interface InitShoppingItemSerializer extends InitChatItemSerializer {
  chats: ChatInitSerializer;
}

export interface InitShoppingType {
  items: InitShoppingItemSerializer[];
  subject: GeneralSubject;
}
/**
 * Actions
 */

export interface ChatInitAction {
  type: typeof CHAT_INIT;
  payload: {
    salesData: InitSalesType[];
    shoppingData: InitShoppingType[];
  };
}

export interface ChatClearAction {
  type: typeof CHAT_CLEAR;
}

export interface ChatStartGlobalActionAction {
  type: typeof CHAT_START_GLOBAL_ACTION;
}

export interface ChatStartChatActionAction {
  type: typeof CHAT_START_CHAT_ACTION;
  payload: ChatIdentifierPayload;
}

export interface ChatFailAction {
  type: typeof CHAT_FAIL;
  payload: { error: unknown };
}

export interface ChatSingleFail {
  type: typeof CHAT_SINGLE_FAIL;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    error: unknown;
  };
}

export interface ChatSetSalesListFocusAction {
  type: typeof CHAT_SET_SALES_LIST_FOCUS;
  payload: { focus: ChatCategoryIdType };
}

export interface ChatSetShoppingListFocusAction {
  type: typeof CHAT_SET_SHOPPING_LIST_FOCUS;
  payload: { focus: ChatCategoryIdType };
}

export interface ChatSetChatFocusAction {
  type: typeof CHAT_SET_CHAT_FOCUS;
  payload: ChatIdentifierPayload;
}

export interface ChatSetComposerAction {
  type: typeof CHAT_SET_COMPOSER;
  payload: {
    value: string;
    objectID: ChatCategoryIdType;
    chatID: number;
  };
}

export interface ChatReceiveMessageAction {
  type: typeof CHAT_RECEIVE_MSG;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    msg: GeneralMessage;
    type: ChatCategorySecondaryType;
  };
}

export interface ChatSendMsgAction {
  type: typeof CHAT_SEND_MSG;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    msg: GeneralMessage;
    type: ChatCategoryType;
  };
}

export interface ChatSystemMsgAction {
  type: typeof CHAT_SYSTEM_MSG;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    msg: string;
  };
}

export interface ChatConfirmMsgAction {
  type: typeof CHAT_CONFIRM_MSG;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    msgID: number;
    data: {
      isSending: boolean;
      _id: string;
    };
  };
}

export interface ChatErrorMsg {
  type: typeof CHAT_ERROR_MSG;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    msgID: number;
  };
}

export interface ChatStartStatusActionAction {
  type: typeof CHAT_START_STATUS_ACTION;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
  };
}

export interface ChatOffertFailAction {
  type: typeof CHAT_OFFERT_FAIL;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    error: unknown;
  };
}

export interface ChatNewItemAction {
  type: typeof CHAT_NEW_ITEM;
  payload: {
    item: GeneralItem;
  };
}

export interface ChatModifyItemAction {
  type: typeof CHAT_MODIFY_ITEM;
  payload: {
    item: GeneralItem;
  };
}

export interface ChatOnlineAction {
  type: typeof CHAT_ONLINE;
}

export interface ChatDisableItem {
  type: typeof CHAT_DISABLE_ITEM;
  payload: {
    type: ChatCategoryType;
    objectID: ChatCategoryIdType;
    chatID?: number;
  };
}

export interface ChatNewChatAction {
  type: typeof CHAT_NEW_CHAT;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    data: ChatSerializer;
  };
}

export interface ChatNewOffertAction {
  type: typeof CHAT_NEW_OFFERT;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    price: number;
    pk: number;
    user: UserSerializer;
  };
}

export interface ChatSetOffertAcceptedAction {
  type: typeof CHAT_ACCEPT_OFFERT;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
  };
}

export interface ChatRemoveOffertAction {
  type: typeof CHAT_REMOVE_OFFERT;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
  };
}

export interface ChatSettleActionAction {
  type: typeof CHAT_SETTLE;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    status: ChatStatus;
  };
}

export interface ChatSetFeedbackAction {
  type: typeof CHAT_SET_FEEDBACK;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    feedback: FEEDBACK_TYPES;
    comment: string;
    fromWS?: boolean;
  };
}

export interface ChatReadAction {
  type: typeof CHAT_READ;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
  };
}

export interface ChatLoadEarlier {
  type: typeof CHAT_LOAD_EARLIER;
  payload: {
    objectID: ChatCategoryIdType;
    chatID: number;
    data: GeneralMessage[];
    toload: boolean;
  };
}

export interface ChatContactUser {
  type: typeof CHAT_CONTACT_USER;
  payload: {
    item: GeneralItem;
    chatID: number;
  };
}

export type TChatActions =
  | ChatInitAction
  | ChatClearAction
  | ChatStartGlobalActionAction
  | ChatStartChatActionAction
  | ChatFailAction
  | ChatSingleFail
  | ChatSetSalesListFocusAction
  | ChatSetShoppingListFocusAction
  | ChatSetChatFocusAction
  | ChatSetComposerAction
  | ChatReceiveMessageAction
  | ChatSendMsgAction
  | ChatSystemMsgAction
  | ChatConfirmMsgAction
  | ChatErrorMsg
  | ChatStartStatusActionAction
  | ChatOffertFailAction
  | ChatNewItemAction
  | ChatModifyItemAction
  | ChatOnlineAction
  | ChatDisableItem
  | ChatNewChatAction
  | ChatNewOffertAction
  | ChatSetOffertAcceptedAction
  | ChatRemoveOffertAction
  | ChatSettleActionAction
  | ChatSetFeedbackAction
  | ChatReadAction
  | ChatLoadEarlier
  | ChatContactUser;
