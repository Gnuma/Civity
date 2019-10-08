import { updateObject } from "../utility";
import update from "immutability-helper";
import {
  CHAT_INIT,
  CHAT_CLEAR,
  CHAT_START_CHAT_ACTION,
  CHAT_START_GLOBAL_ACTION,
  CHAT_FAIL,
  CHAT_SINGLE_FAIL,
  CHAT_SET_SALES_LIST_FOCUS,
  CHAT_SET_SHOPPING_LIST_FOCUS,
  CHAT_SET_CHAT_FOCUS,
  CHAT_SET_COMPOSER,
  CHAT_RECEIVE_MSG,
  CHAT_SEND_MSG,
  CHAT_SYSTEM_MSG,
  CHAT_CONFIRM_MSG,
  CHAT_ERROR_MSG,
  CHAT_READ,
  CHAT_SETTLE,
  CHAT_LOAD_EARLIER,
  CHAT_CONTACT_USER,
  CHAT_NEW_ITEM,
  CHAT_MODIFY_ITEM,
  CHAT_NEW_CHAT,
  CHAT_START_STATUS_ACTION,
  CHAT_NEW_OFFERT,
  CHAT_REMOVE_OFFERT,
  CHAT_ACCEPT_OFFERT,
  CHAT_OFFERT_FAIL,
  CHAT_ONLINE,
  CHAT_SET_FEEDBACK,
  CHAT_DISABLE_ITEM,
  ChatType,
  TChatActions,
  SalesData,
  ChatStatus,
  ChatCategoryType,
  OffertStatus,
  ShoppingData
} from "./types";
import {
  getSubjectIndex,
  getItemIndex,
  highlightItem,
  createSystemMessage,
  createOffert
} from "../../utils/chatUtility";
import { formatOffice, formatUser } from "../../utils/helper";

const initialState: ChatType = {
  data: {},
  salesOrderedData: [],
  shoppingOrderedData: [],
  contactedItems: {},
  error: undefined,
  salesFocus: 0,
  shoppingFocus: 0,
  chatFocus: 0,
  loading: false
};

export default (state = initialState, action: TChatActions): ChatType => {
  switch (action.type) {
    case CHAT_INIT:
      return chatInit(state, action);

    case CHAT_CLEAR:
      return chatClear(state, action);

    case CHAT_START_GLOBAL_ACTION:
      return chatStartGlobalAction(state, action);

    case CHAT_START_CHAT_ACTION:
      return chatStartChatAction(state, action);

    case CHAT_FAIL:
      return chatFail(state, action);

    case CHAT_SINGLE_FAIL:
      return chatSingleFail(state, action);

    case CHAT_SET_SALES_LIST_FOCUS:
      return chatSetSalesListFocus(state, action);

    case CHAT_SET_SHOPPING_LIST_FOCUS:
      return chatSetShoppingListFocus(state, action);

    case CHAT_SET_CHAT_FOCUS:
      return chatSetChatFocus(state, action);

    case CHAT_SET_COMPOSER:
      return chatSetComposer(state, action);

    case CHAT_RECEIVE_MSG:
      return chatReceiveMessage(state, action);

    case CHAT_SYSTEM_MSG:
      return chatSystemMsg(state, action);

    case CHAT_SEND_MSG:
      return chatSendMsg(state, action);

    case CHAT_CONFIRM_MSG:
      return chatConfirmMsg(state, action);

    case CHAT_ERROR_MSG:
      return chatErrorMsg(state, action);

    case CHAT_READ:
      return chatRead(state, action);

    case CHAT_SETTLE:
      return chatSettle(state, action);

    case CHAT_NEW_CHAT:
      return chatNewChat(state, action);

    case CHAT_START_STATUS_ACTION:
      return chatStartStatusAction(state, action);

    case CHAT_LOAD_EARLIER:
      return chatLoadEarlier(state, action);

    case CHAT_CONTACT_USER:
      return chatContactUser(state, action);

    case CHAT_NEW_OFFERT:
      return chatNewOffert(state, action);

    case CHAT_REMOVE_OFFERT:
      return chatRemoveOffert(state, action);

    case CHAT_ACCEPT_OFFERT:
      return chatAcceptOffert(state, action);

    case CHAT_OFFERT_FAIL:
      return chatOffertFail(state, action);

    case CHAT_NEW_ITEM:
      return chatNewItem(state, action);

    case CHAT_MODIFY_ITEM:
      return chatModifyItem(state, action);

    case CHAT_ONLINE:
      return chatStartGlobalAction(state, action);

    case CHAT_SET_FEEDBACK:
      return chatSetFeedback(state, action);

    case CHAT_DISABLE_ITEM:
      return chatDisableItem(state, action);

    default:
      return state;
  }
};

const formatSalesData = (arrayData: SalesData[], focus = 0) => {
  console.log("SALES: ", arrayData);

  let orderedData = [];
  let data: { [key: string]: SalesData } = {};
  for (let i = 0; i < arrayData.length; i++) {
    const { chats, _id: itemID, seller, ...restItem } = arrayData[i];

    seller.office = formatOffice(seller.course);
    delete seller.course;

    data[itemID] = {
      _id: itemID,
      seller,
      ...restItem,
      chats: {}
    };
    let orderedChats = [];
    for (let f = 0; f < chats.length; f++) {
      const { buyer, ...chat } = chats[f];
      orderedChats.push(chat._id);

      buyer.office = formatOffice(buyer.course);
      delete buyer.course;

      //for (let m = 0; m < chat.messages.length; m++)
      //  chat.messages[m].createdAt = new Date(chat.messages[m].createdAt);

      data[itemID].chats[chat._id] = {
        UserTO: buyer,
        ...chat,
        composer: "",
        loading: false
      };
    }
    orderedData.push({ itemID, chats: orderedChats });
    data[itemID] = {
      ...data[itemID]
    };
  }

  return {
    salesFormattedData: data,
    salesOrderedData: orderedData,
    salesFocus: focus
  };
};

const formatShoppingData = (arrayData, focus = 0) => {
  console.log("SHOPPING: ", arrayData);
  let orderedData = [];
  let data = {};
  let contactedItems = {};
  for (let i = 0; i < arrayData.length; i++) {
    const { subject, items, newsCount, ...restSubject } = arrayData[i];

    data["s" + subject._id] = {
      _id: "s" + subject._id,
      title: subject.title,
      ...restSubject,
      newsCount: newsCount || 0,
      chats: {}
    };
    let orderedChats = [];
    for (let f = 0; f < items.length; f++) {
      const { chats: chat, seller, ...restItem } = items[f];
      orderedChats.push(chat._id);

      seller.office = formatOffice(seller.course);
      delete seller.course;

      const item = {
        ...restItem,
        seller
      };

      contactedItems[restItem._id] = true;

      //for (let m = 0; m < chat.messages.length; m++)
      //  chat.messages[m].createdAt = new Date(chat.messages[m].createdAt);

      data["s" + subject._id].chats[chat._id] = {
        UserTO: seller,
        item,
        ...chat,
        composer: "",
        loading: false
      };
    }
    orderedData.push({ subjectID: "s" + subject._id, chats: orderedChats });
  }
  return {
    shoppingFormattedData: data,
    shoppingOrderedData: orderedData,
    shoppingFocus: focus,
    contactedItems
  };
};
