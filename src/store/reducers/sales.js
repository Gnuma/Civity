import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";
import uuid from "uuid";

import {
  getItemIndex,
  getChatIndex,
  highlightItem,
  createOffert,
  createSystemMessage
} from "../../utils/chatUtility";
import { newChat } from "../../mockData/Chat2";
import { ChatStatus, OffertStatus } from "../../utils/constants";

const initialState = {
  data: null,
  orderedData: null,
  error: null,
  focus: null,
  chatFocus: null,
  loading: false
};

const salesInit = (state, action) => {
  const data = action.payload.data;
  return updateObject(state, formatData(data));
};

const salesStartAction = (state, action) => {
  const { itemID, chatID } = action.payload;
  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            loading: { $set: true }
          }
        }
      }
    }
  });
};

const salesStartGlobalAction = (state, action) => {
  return updateObject(state, {
    loading: true
  });
};

const salesError = (state, action) => {
  return updateObject(state, {
    error: action.payload.error
  });
};

const salesFocus = (state, action) => {
  return updateObject(state, {
    focus: action.payload.focus
  });
};

const salesComposer = (state, action) => {
  const { itemID, chatID, composer } = action.payload;
  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            composer: { $set: composer }
          }
        }
      }
    }
  });
};

const salesReceiveMsg = (state, action) => {
  const { item, chat, msg } = action.payload;
  inChat = state.chatFocus === chat;
  const itemIndex = getItemIndex(item, state.orderedData);
  const chatIndex = getChatIndex(chat, state.orderedData[itemIndex]);
  const hadNews = state.data[item].chats[chat].hasNews > 0;

  return update(state, {
    data: {
      [item]: {
        chats: {
          [chat]: {
            messages: { $unshift: [msg] },
            hasNews: { $apply: oldHasNews => (inChat ? 0 : oldHasNews + 1) }
          }
        },
        newsCount: {
          $apply: oldNewsCount =>
            !inChat && hadNews ? oldNewsCount + 1 : oldNewsCount
        }
      }
    },
    orderedData: {
      [itemIndex]: {
        chats: {
          $apply: item => highlightItem(item, chatIndex)
        }
      }
    }
  });
};

const salesSendMsg = (state, action) => {
  const { itemID, chatID, msg } = action.payload;

  const itemIndex = getItemIndex(itemID, state.orderedData);
  const chatIndex = getChatIndex(chatID, state.orderedData[itemIndex]);

  console.log(itemID, chatID, msg);
  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            messages: { $unshift: [msg] },
            composer: { $set: "" }
          }
        }
      }
    },
    orderedData: {
      [itemIndex]: {
        chats: {
          $apply: item => highlightItem(item, chatIndex)
        }
      }
    }
  });
};

const salesConfirmMsg = (state, action) => {
  const { itemID, chatID, msgID, data } = action.payload;
  try {
    const chat = state.data[itemID].chats[chatID].messages;
    console.log(data);
    for (let i = 0; i < chat.length; i++) {
      if (chat[i]._id == msgID) {
        return update(state, {
          data: {
            [itemID]: {
              chats: {
                [chatID]: {
                  messages: { [i]: { $merge: data } }
                }
              }
            }
          }
        });
      }
    }
    throw "Message Not Found when confirming";
  } catch (error) {
    console.warn(error);
    console.log(error);
  }
  return state;
};

const salesReadChat = (state, action) => {
  const { itemID, chatID } = action.payload;
  const hasNews = state.data[itemID].chats[chatID].hasNews;

  return update(state, {
    data: {
      [itemID]: {
        newsCount: {
          $apply: oldCount => {
            return hasNews ? oldCount - 1 : oldCount;
          }
        },
        chats: {
          [chatID]: {
            hasNews: { $set: 0 }
          }
        }
      }
    }
  });
};

const salesSettleChat = (state, action) => {
  const { itemID, chatID, status } = action.payload;
  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            status: { $set: status },
            loading: { $set: false }
          }
        }
      }
    }
  });
};

const salesSetChatFocus = (state, action) => {
  const { chatID } = action.payload;
  return updateObject(state, {
    chatFocus: chatID
  });
};

const salesRetrieveData = (state, action) => {
  let { data } = action.payload;

  const { orderedData: newOrder, ...retrievedData } = formatData(
    data,
    state.focus
  );
  const oldOrder = state.orderedData;
  let orderedData = [];

  for (let i = 0; i < oldOrder.length; i++) {
    for (let f = 0; f < newOrder.length; f++) {
      if (newOrder[f].itemID === oldOrder[i].itemID) {
        orderedData.push(newOrder.splice(f, 1)[0]);
        break;
      }
    }
  }
  newOrder.forEach(object => orderedData.push(object));
  return updateObject(state, { orderedData, ...retrievedData });
};

const salesLoadEarlier = (state, action) => {
  const { itemID, chatID, data } = action.payload;
  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            messages: { $push: data },
            loading: { $set: false }
          }
        }
      }
    }
  });
};

const salesNewChat = (state, action) => {
  const { itemID, chatID, data } = action.payload;
  const { pk, ...restItem } = data.item;

  const chat = {
    _id: chatID,
    UserTO: {
      _id: data.buyer.pk,
      username: data.buyer.user.username
    },
    hasNews: 1,
    status: ChatStatus.PENDING,
    messages: [],
    loading: false,
    composer: "",
    offerts: []
  };
  const item = {
    _id: itemID,
    ...restItem,
    chats: {
      [chatID]: chat
    },
    newsCount: 1
  };

  const itemIndex = getItemIndex(itemID, state.orderedData);

  if (itemIndex != -1) {
    return update(state, {
      data: {
        [itemID]: {
          newsCount: { $apply: oldCount => oldCount + 1 },
          chats: {
            [chatID]: {
              $set: chat
            }
          }
        }
      },
      orderedData: {
        [itemIndex]: {
          chats: { $unshift: [chatID] }
        }
      }
    });
  } else {
    return update(state, {
      data: {
        [itemID]: { $set: item }
      },
      orderedData: {
        $push: [{ itemID, chats: [chatID] }]
      }
    });
  }
};

const salesStartStatusAction = (state, action) => {
  const { itemID, chatID } = action.payload;
  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: true }
          }
        }
      }
    }
  });
};

const salesCreateOffert = (state, action) => {
  const { price, itemID, chatID, pk } = action.payload;
  const user = action.payload.user
    ? action.payload.user
    : {
        _id: state.data[itemID].chats[chatID].UserTO._id,
        user: {
          username: state.data[itemID].chats[chatID].UserTO.username
        }
      };

  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: false },
            offerts: { $unshift: [createOffert(user, price, pk)] },
            messages: {
              $unshift: [
                createSystemMessage(
                  user.username + " ha inviato un offerta: €" + price + ".00"
                )
              ]
            }
          }
        }
      }
    }
  });
};

const salesDeleteOffert = (state, action) => {
  const { itemID, chatID } = action.payload;
  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: false },
            offerts: { 0: { $merge: { status: OffertStatus.REJECTED } } }
          }
        }
      }
    }
  });
};

const salesAcceptOffert = (state, action) => {
  const { itemID, chatID } = action.payload;
  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            offerts: { 0: { $merge: { status: OffertStatus.ACCEPTED } } },
            statusLoading: { $set: false }
          }
        }
      }
    }
  });
};

const salesOffertFail = (state, action) => {
  const { itemID, chatID } = action.payload;
  return update(state, {
    data: {
      [itemID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: false }
          }
        }
      }
    }
  });
};

const salesClear = () => initialState;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SALES_INIT:
      return salesInit(state, action);

    case actionTypes.SALES_START_ACTION:
      return salesStartAction(state, action);

    case actionTypes.SALES_FAIL:
      return salesError(state, action);

    case actionTypes.SALES_SET_FOCUS:
      return salesFocus(state, action);

    case actionTypes.SALES_SET_COMPOSER:
      return salesComposer(state, action);

    case actionTypes.SALES_RECEIVE_MSG:
      return salesReceiveMsg(state, action);

    case actionTypes.SALES_SEND_MSG:
      return salesSendMsg(state, action);

    case actionTypes.SALES_CONFIRM_MSG:
      return salesConfirmMsg(state, action);

    case actionTypes.SALES_READ_CHAT:
      return salesReadChat(state, action);

    case actionTypes.SALES_SETTLE_CHAT:
      return salesSettleChat(state, action);

    case actionTypes.SALES_SET_CHAT_FOCUS:
      return salesSetChatFocus(state, action);

    case actionTypes.SALES_START_GLOBAL_ACTION:
      return salesStartGlobalAction(state, action);

    case actionTypes.SALES_RETRIEVE_DATA:
      return salesRetrieveData(state, action);

    case actionTypes.SALES_LOAD_EARLIER:
      return salesLoadEarlier(state, action);

    case actionTypes.SALES_NEW_CHAT:
      return salesNewChat(state, action);

    case actionTypes.SALES_START_STATUS_ACTION:
      return salesStartStatusAction(state, action);

    case actionTypes.SALES_CREATE_OFFERT:
      return salesCreateOffert(state, action);

    case actionTypes.SALES_REMOVE_OFFERT:
      return salesDeleteOffert(state, action);

    case actionTypes.SALES_ACCEPT_OFFERT:
      return salesAcceptOffert(state, action);

    case actionTypes.SALES_OFFERT_FAIL:
      return salesOffertFail(state, action);

    case actionTypes.SALES_CLEAR:
      return salesClear(state, action);

    default:
      return state;
  }
};

export default reducer;

/*
const formatData = (data, focus = 0) => {
  let orderedData = [];
  for (itemKey in data) {
    let lastMsg = new Date(0, 0, 0);
    const item = data[itemKey].chats;
    //orderedData.push(itemKey);
    let orderedChats = [];
    for (chatKey in item) {
      orderedChats.push(chatKey); //TO-DO
      const chat = item[chatKey];
      lastMsg =
        chat.messages[0] && chat.messages[0].createdAt > lastMsg
          ? chat.messages[0].createdAt
          : lastMsg;
      data[itemKey].chats[chatKey] = {
        ...data[itemKey].chats[chatKey],
        composer: "",
        loading: false
      };
    }
    orderedData.push({ itemID: itemKey, chats: orderedChats }); //TO-DO
    data[itemKey] = { ...data[itemKey], lastMsg };
  }

  return {
    data,
    orderedData,
    focus,
    loading: false
  };
};
*/

const formatData = (arrayData, focus = 0) => {
  console.log("SALES: ", arrayData);

  let orderedData = [];
  let data = {};
  for (let i = 0; i < arrayData.length; i++) {
    const { chats, _id: itemID, ...restItem } = arrayData[i];

    data[itemID] = {
      _id: itemID,
      ...restItem,
      chats: {}
    };
    let orderedChats = [];
    for (let f = 0; f < chats.length; f++) {
      const chat = chats[f];
      orderedChats.push(chat._id);

      const UserTO = {
        _id: chat.buyer._id,
        ...chat.buyer.user
      };

      for (let m = 0; m < chat.messages.length; m++)
        chat.messages[m].createdAt = new Date(chat.messages[m].createdAt);

      data[itemID].chats[chat._id] = {
        UserTO,
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
    data,
    orderedData,
    focus,
    loading: false
  };
};
