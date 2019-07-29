import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";
import {
  getSubjectIndex,
  getChatIndex,
  highlightItem,
  createOffert,
  createSystemMessage
} from "../../utils/chatUtility";
import {
  shoppingLoadMockNew,
  sellerChatList,
  mockContactItem
} from "../../mockData/Chat2";
import _ from "lodash";
import uuid from "uuid";
import { ChatStatus, OffertStatus } from "../../utils/constants";

const initialState = {
  data: null,
  orderedData: null,
  error: null,
  focus: null,
  chatFocus: null,
  loading: false
};

const shoppingInit = (state, action) => {
  const data = action.payload.data;
  return updateObject(state, formatData(data));
};

const shoppingStartAction = (state, action) => {
  const { subjectID, chatID } = action.payload;
  return update(state, {
    data: {
      [subjectID]: {
        chats: {
          [chatID]: {
            loading: { $set: true }
          }
        }
      }
    }
  });
};

const shoppingStartGlobalAction = (state, action) => {
  return updateObject(state, {
    loading: true
  });
};

const shoppingError = (state, action) => {
  return updateObject(state, {
    error: action.payload.error
  });
};

const shoppingFocus = (state, action) => {
  return updateObject(state, {
    focus: action.payload.focus
  });
};

const shoppingComposer = (state, action) => {
  const { subjectID, chatID, composer } = action.payload;
  return update(state, {
    data: {
      [subjectID]: {
        chats: {
          [chatID]: {
            composer: { $set: composer }
          }
        }
      }
    }
  });
};

const shoppingReceiveMsg = (state, action) => {
  const { subjectID, chatID, msg } = action.payload;
  inChat = state.chatFocus === chatID;
  const subjectIndex = getSubjectIndex(subjectID, state.orderedData);
  const chatIndex = getChatIndex(chatID, state.orderedData[subjectIndex]);
  const hadNews = state.data[subjectID].chats[chatID].hasNews > 0;

  return update(state, {
    data: {
      [subjectID]: {
        chats: {
          [chatID]: {
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
      [subjectIndex]: {
        chats: {
          $apply: subject => highlightItem(subject, chatIndex)
        }
      }
    }
  });
};

const shoppingSendMsg = (state, action) => {
  const { subjectID, chatID, msg } = action.payload;
  //console.log(subjectID, chatID, msg);
  const subjectIndex = getSubjectIndex(subjectID, state.orderedData);
  const chatIndex = getChatIndex(chatID, state.orderedData[subjectIndex]);

  return update(state, {
    data: {
      [subjectID]: {
        chats: {
          [chatID]: {
            messages: { $unshift: [msg] },
            composer: { $set: "" }
          }
        }
      }
    },
    orderedData: {
      [subjectIndex]: {
        chats: {
          $apply: subject => highlightItem(subject, chatIndex)
        }
      }
    }
  });
};

const shoppingConfirmMsg = (state, action) => {
  const { subjectID, chatID, msgID, data } = action.payload;
  try {
    console.log(state);
    const chat = state.data[subjectID].chats[chatID].messages;
    console.log(data);
    for (let i = 0; i < chat.length; i++) {
      if (chat[i]._id == msgID) {
        return update(state, {
          data: {
            [subjectID]: {
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

const shoppingReadChat = (state, action) => {
  const { subjectID, chatID } = action.payload;
  const hasNews = state.data[subjectID].chats[chatID].hasNews;

  return update(state, {
    data: {
      [subjectID]: {
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

const shoppingSettleChat = (state, action) => {
  const { subjectID, chatID, status } = action.payload;
  return update(state, {
    data: {
      [subjectID]: {
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

const shoppingSetChatFocus = (state, action) => {
  const { chatID } = action.payload;
  return updateObject(state, {
    chatFocus: chatID
  });
};

const shoppingRetrieveData = (state, action) => {
  const { data } = action.payload;
  console.log(data);
  const { orderedData: newOrder, ...retrievedData } = formatData(
    data,
    state.focus
  );
  const oldOrder = state.orderedData;
  let orderedData = [];

  for (let i = 0; i < oldOrder.length; i++) {
    for (let f = 0; f < newOrder.length; f++) {
      if (newOrder[f].subjectID === oldOrder[i].subjectID) {
        orderedData.push(newOrder.splice(f, 1)[0]);
        break;
      }
    }
  }
  newOrder.forEach(object => orderedData.push(object));
  return updateObject(state, { orderedData, ...retrievedData });
};

const shoppingLoadEarlier = (state, action) => {
  const { subjectID, chatID, data } = action.payload;
  return update(state, {
    data: {
      [subjectID]: {
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

const shoppingContactUser = (state, action) => {
  const { item, chatID } = action.payload;
  const subjectID = item.book.subject._id;

  const chat = {
    _id: chatID,
    item: item,
    UserTO: item.seller.user,
    hasNews: false,
    status: ChatStatus.LOCAL,
    messages: [],
    offerts: []
  };
  const subject = {
    _id: subjectID,
    title: item.book.subject.title,
    newsCount: 0,
    chats: {}
  };
  const subjectIndex = getSubjectIndex(subjectID, state.orderedData);

  return update(state, {
    data: {
      [subjectID]: existingSubject =>
        update(existingSubject || subject, {
          chats: { [chatID]: { $set: chat } }
        })
    },
    orderedData:
      subjectIndex === -1
        ? {
            $push: [
              {
                subjectID: subjectID,
                chats: [chatID]
              }
            ]
          }
        : {
            [subjectIndex]: {
              chats: {
                $push: [chatID]
              }
            }
          }
  });
};

const shoppingStartStatusAction = (state, action) => {
  const { subjectID, chatID } = action.payload;
  return update(state, {
    data: {
      [subjectID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: true }
          }
        }
      }
    }
  });
};

const shoppingCreateOffert = (state, action) => {
  const { price, subjectID, chatID, pk } = action.payload;
  console.log(state.data[subjectID].chats[chatID].UserTO);

  const user = action.payload.user
    ? action.payload.user
    : {
        _id: state.data[subjectID].chats[chatID].UserTO._id,
        user: {
          username: state.data[subjectID].chats[chatID].UserTO.username
        }
      };

  return update(state, {
    data: {
      [subjectID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: false },
            offerts: { $unshift: [createOffert(user, price, pk)] },
            messages: {
              $unshift: [
                createSystemMessage(
                  user.user.username +
                    " ha inviato un offerta: €" +
                    price +
                    ".00"
                )
              ]
            }
          }
        }
      }
    }
  });
};

const shoppingDeleteOffert = (state, action) => {
  const { subjectID, chatID } = action.payload;
  return update(state, {
    data: {
      [subjectID]: {
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

const shoppingAcceptOffert = (state, action) => {
  const { subjectID, chatID } = action.payload;
  return update(state, {
    data: {
      [subjectID]: {
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

const shoppingOffertFail = (state, action) => {
  const { subjectID, chatID } = action.payload;
  return update(state, {
    data: {
      [subjectID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: false }
          }
        }
      }
    }
  });
};

const shoppingClear = () => initialState;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOPPING_INIT:
      return shoppingInit(state, action);

    case actionTypes.SHOPPING_START_ACTION:
      return shoppingStartAction(state, action);

    case actionTypes.SHOPPING_FAIL:
      return shoppingError(state, action);

    case actionTypes.SHOPPING_SET_FOCUS:
      return shoppingFocus(state, action);

    case actionTypes.SHOPPING_SET_COMPOSER:
      return shoppingComposer(state, action);

    case actionTypes.SHOPPING_RECEIVE_MSG:
      return shoppingReceiveMsg(state, action);

    case actionTypes.SHOPPING_SEND_MSG:
      return shoppingSendMsg(state, action);

    case actionTypes.SHOPPING_CONFIRM_MSG:
      return shoppingConfirmMsg(state, action);

    case actionTypes.SHOPPING_READ_CHAT:
      return shoppingReadChat(state, action);

    case actionTypes.SHOPPING_SETTLE_CHAT:
      return shoppingSettleChat(state, action);

    case actionTypes.SHOPPING_SET_CHAT_FOCUS:
      return shoppingSetChatFocus(state, action);

    case actionTypes.SHOPPING_RETRIEVE_DATA:
      return shoppingRetrieveData(state, action);

    case actionTypes.SHOPPING_START_GLOBAL_ACTION:
      return shoppingStartGlobalAction(state, action);

    case actionTypes.SHOPPING_LOAD_EARLIER:
      return shoppingLoadEarlier(state, action);

    case actionTypes.SHOPPING_CONTACT_USER:
      return shoppingContactUser(state, action);

    case actionTypes.SHOPPING_START_STATUS_ACTION:
      return shoppingStartStatusAction(state, action);

    case actionTypes.SHOPPING_CREATE_OFFERT:
      return shoppingCreateOffert(state, action);

    case actionTypes.SHOPPING_REMOVE_OFFERT:
      return shoppingDeleteOffert(state, action);

    case actionTypes.SHOPPING_ACCEPT_OFFERT:
      return shoppingAcceptOffert(state, action);

    case actionTypes.SHOPPING_OFFERT_FAIL:
      return shoppingOffertFail(state, action);

    case actionTypes.SHOPPING_CLEAR:
      return shoppingClear(state, action);

    default:
      return state;
  }
};

export default reducer;

/*
const formatData = (data, focus = 0) => {
  let orderedData = [];
  for (subjectKey in data) {
    let lastMsg = new Date(0, 0, 0);
    const subject = data[subjectKey].chats;
    let orderedChats = [];
    for (chatKey in subject) {
      orderedChats.push(chatKey); //TO-DO
      const chat = subject[chatKey];
      lastMsg =
        chat.messages[0] && chat.messages[0].createdAt > lastMsg
          ? chat.messages[0].createdAt
          : lastMsg;
      data[subjectKey].chats[chatKey] = {
        ...data[subjectKey].chats[chatKey],
        composer: "",
        loading: false
      };
    }
    orderedData.push({ subjectID: subjectKey, chats: orderedChats }); //TO-DO
    data[subjectKey] = { ...data[subjectKey], lastMsg };
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
  let orderedData = [];
  let data = {};
  for (let i = 0; i < arrayData.length; i++) {
    const { subject, items, ...restSubject } = arrayData[i];

    data[subject._id] = {
      _id: subject._id,
      title: subject.title,
      ...restSubject,
      chats: {}
    };
    let orderedChats = [];
    for (let f = 0; f < items.length; f++) {
      const { chats: chat, seller, ...restItem } = items[f];
      orderedChats.push(chat._id);

      const UserTO = {
        _id: seller._id,
        ...seller.user
      };
      const item = {
        ...restItem
      };

      for (let m = 0; m < chat.messages.length; m++)
        chat.messages[m].createdAt = new Date(chat.messages[m].createdAt);

      data[subject._id].chats[chat._id] = {
        UserTO,
        item,
        ...chat,
        composer: "",
        loading: false
      };
    }
    orderedData.push({ subjectID: subject._id, chats: orderedChats });
  }
  return {
    data,
    orderedData,
    focus,
    loading: false
  };
};
