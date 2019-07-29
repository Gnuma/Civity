import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";
import uuid from "uuid";
import {
  getSubjectIndex,
  getItemIndex,
  highlightItem,
  createSystemMessage,
  createOffert
} from "../../utils/chatUtility";
import { ChatType, ChatStatus, OffertStatus } from "../../utils/constants";
import { formatOffice, formatUser } from "../../utils/helper";

const initialState = {
  data: {},
  salesOrderedData: [],
  shoppingOrderedData: [],
  error: null,
  salesFocus: null,
  shoppingFocus: null,
  chatFocus: null,
  loading: false
};

const chatInit = (state, { payload: { salesData, shoppingData } }) => {
  const { salesFormattedData, ...salesRest } = formatSalesData(salesData);
  const { shoppingFormattedData, ...shoppingRest } = formatShoppingData(
    shoppingData
  );

  return updateObject(state, {
    data: {
      ...salesFormattedData,
      ...shoppingFormattedData
    },
    ...salesRest,
    ...shoppingRest,
    loading: false
  });
};

const chatClear = () => initialState;

const chatStartGlobalAction = (state, action) =>
  update(state, {
    loading: { $set: true }
  });

const chatStartChatAction = (state, { payload: { objectID, chatID } }) =>
  update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            loading: { $set: true }
          }
        }
      }
    }
  });

const chatFail = (state, { payload: { error } }) =>
  update(state, {
    error: { $set: error },
    loading: { $set: false }
  });

const chatSingleFail = (state, { payload: { objectID, chatID, error } }) =>
  update(state, {
    error: { $set: error },
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            loading: { $set: false }
          }
        }
      }
    }
  });

const chatSetSalesListFocus = (state, { payload: { focus } }) =>
  update(state, {
    salesFocus: { $set: focus }
  });

const chatSetShoppingListFocus = (state, { payload: { focus } }) =>
  update(state, {
    shoppingFocus: { $set: focus }
  });

const chatSetChatFocus = (state, { payload: { chatID } }) =>
  update(state, {
    chatFocus: { $set: chatID }
  });

const chatSetComposer = (state, { payload: { objectID, chatID, value } }) =>
  update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            composer: { $set: value }
          }
        }
      }
    }
  });

const chatReceiveMessage = (
  state,
  { payload: { objectID, chatID, msg, type } }
) => {
  const orderedType =
    type === "sale" ? "salesOrderedData" : "shoppingOrderedData";
  const objectIndex =
    type === "sale"
      ? getItemIndex(objectID, state.salesOrderedData)
      : getSubjectIndex(objectID, state.shoppingOrderedData);
  const chatIndex = (chatID, state[orderedType][objectIndex]);
  const hadNews = state.data[objectID].chats[chatID].hasNews > 0;

  return update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            messages: { $unshift: [msg] },
            hasNews: { $apply: oldHasNews => oldHasNews + 1 }
          }
        },
        newsCount: {
          $apply: oldNewsCount => (hadNews ? oldNewsCount + 1 : oldNewsCount)
        }
      }
    },
    [orderedType]: {
      [objectIndex]: {
        chats: {
          $apply: object => highlightItem(object, chatIndex)
        }
      }
    }
  });
};

const chatSystemMsg = (state, { payload: { objectID, chatID, msg } }) => {
  const type = String(objectID).charAt(0) === "s" ? "shopping" : "sale";
  const messageData = createSystemMessage(msg);
  return chatReceiveMessage(state, {
    payload: { objectID, chatID, msg: messageData, type }
  });
};

const chatSendMsg = (state, { payload: { objectID, chatID, msg, type } }) => {
  const orderedType =
    type === ChatType.sales ? "salesOrderedData" : "shoppingOrderedData";
  const objectIndex =
    type === ChatType.sales
      ? getItemIndex(objectID, state.salesOrderedData)
      : getSubjectIndex(objectID, state.shoppingOrderedData);
  const chatIndex = (chatID, state[orderedType][objectIndex]);
  console.log(type, orderedType, objectIndex, chatIndex);

  return update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            messages: { $unshift: [msg] },
            composer: { $set: "" }
          }
        }
      }
    },
    [orderedType]: {
      [objectIndex]: {
        chats: {
          $apply: object => highlightItem(object, chatIndex)
        }
      }
    }
  });
};

const chatConfirmMsg = (
  state,
  { payload: { objectID, chatID, msgID, data } }
) => {
  try {
    const chat = state.data[objectID].chats[chatID].messages;
    console.log(data);
    for (let i = 0; i < chat.length; i++) {
      if (chat[i]._id == msgID) {
        return update(state, {
          data: {
            [objectID]: {
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
    return state;
  }
};

const chatErrorMsg = (state, { payload: { objectID, chatID, msgID } }) => {
  try {
    const chat = state.data[objectID].chats[chatID].messages;
    for (let i = 0; i < chat.length; i++) {
      if (chat[i]._id == msgID) {
        return update(state, {
          data: {
            [objectID]: {
              chats: {
                [chatID]: {
                  messages: {
                    [i]: {
                      $merge: {
                        isSending: false,
                        error: true
                      }
                    }
                  }
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
    return state;
  }
};

const chatRead = (state, { payload: { objectID, chatID } }) => {
  console.log(objectID, chatID);
  const hasNews = state.data[objectID].chats[chatID].hasNews;
  return update(state, {
    data: {
      [objectID]: {
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

const chatSettle = (state, { payload: { objectID, chatID, status } }) =>
  update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            status: { $set: status },
            statusLoading: { $set: false },
            loading: { $set: false }
          }
        }
      }
    }
  });

const chatNewChat = (state, { payload: { objectID, chatID, data } }) => {
  const { pk, ...restItem } = data.item;
  const UserTO = formatUser(data.buyer);

  const chat = {
    _id: chatID,
    UserTO,
    hasNews: 1,
    status: ChatStatus.PENDING,
    messages: [],
    loading: false,
    composer: "",
    offerts: [],
    toload: false,
    feedbacks: {}
  };
  const item = {
    _id: objectID,
    ...restItem,
    chats: {
      [chatID]: chat
    },
    newsCount: 1
  };

  const itemIndex = getItemIndex(objectID, state.salesOrderedData);

  if (itemIndex != -1) {
    return update(state, {
      data: {
        [objectID]: {
          newsCount: { $apply: oldCount => oldCount + 1 },
          chats: {
            [chatID]: {
              $set: chat
            }
          }
        }
      },
      salesOrderedData: {
        [itemIndex]: {
          chats: { $unshift: [chatID] }
        }
      }
    });
  } else {
    return update(state, {
      data: {
        [objectID]: { $set: item }
      },
      salesOrderedData: {
        $push: [{ objectID, chats: [objectID] }]
      }
    });
  }
};

const chatStartStatusAction = (state, { payload: { objectID, chatID } }) =>
  update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: true }
          }
        }
      }
    }
  });

const chatLoadEarlier = (
  state,
  { payload: { objectID, chatID, data, toload } }
) =>
  update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            messages: { $push: data },
            loading: { $set: false },
            toload: { $set: toload }
          }
        }
      }
    }
  });

const chatContactUser = (state, { payload: { item, chatID } }) => {
  const subjectID = "s" + item.book.subject._id;
  const chat = {
    _id: chatID,
    item: item,
    UserTO: item.seller,
    hasNews: false,
    status: ChatStatus.LOCAL,
    messages: [],
    offerts: [],
    feedbacks: {}
  };
  const subject = {
    _id: subjectID,
    title: item.book.subject.title,
    newsCount: 0,
    chats: {}
  };
  const subjectIndex = getSubjectIndex(subjectID, state.shoppingOrderedData);

  return update(state, {
    data: {
      [subjectID]: existingSubject =>
        update(existingSubject || subject, {
          chats: { [chatID]: { $set: chat } }
        })
    },
    shoppingOrderedData:
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

const chatNewItem = (state, { payload: { item } }) => {
  console.log(item);
  const { pk: _id, ...rest } = item;
  return update(state, {
    data: {
      [_id]: {
        $set: {
          _id,
          chats: {},
          hasNews: 0,
          ...rest
        }
      }
    },
    salesOrderedData: {
      $push: [
        {
          itemID: _id,
          chats: []
        }
      ]
    }
  });
};

const chatModifyItem = (state, { payload: { item } }) => {
  console.log(item);
  const { pk: _id, ...rest } = item;
  return update(state, {
    data: {
      [_id]: {
        $merge: {
          _id,
          ...rest
        }
      }
    }
  });
};

const chatNewOffert = (
  state,
  { payload: { objectID, chatID, price, pk, user } }
) => {
  user = user || state.data[objectID].chats[chatID].UserTO;

  return update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: false },
            offerts: { $unshift: [createOffert(user, price, pk)] }
          }
        }
      }
    }
  });
};

const chatRemoveOffert = (state, { payload: { objectID, chatID } }) => {
  return update(state, {
    data: {
      [objectID]: {
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

const chatAcceptOffert = (state, { payload: { objectID, chatID } }) =>
  update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            status: { $set: ChatStatus.EXCHANGE },
            offerts: { 0: { $merge: { status: OffertStatus.ACCEPTED } } },
            statusLoading: { $set: false }
          }
        }
      }
    }
  });

const chatOffertFail = (state, { payload: { objectID, chatID, error } }) =>
  update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            statusLoading: { $set: false }
          }
        }
      }
    },
    error: { $set: error }
  });

const chatSetFeedback = (
  state,
  { payload: { objectID, chatID, feedback, comment, fromWS } }
) => {
  let isBuyer = String(objectID).charAt(0) == "s";
  if (fromWS) isBuyer = !isBuyer;
  const type = isBuyer ? "buyer" : "seller";
  const reciever = isBuyer ? "seller" : "buyer";
  //Set completed if the other feedback is not null
  const setCompleted = !!state.data[objectID].chats[chatID].feedbacks[reciever];

  console.log(type, objectID, chatID, feedback, comment);
  return update(state, {
    data: {
      [objectID]: {
        chats: {
          [chatID]: {
            status: {
              $apply: oldStatus =>
                setCompleted ? ChatStatus.COMPLETED : oldStatus
            },
            statusLoading: { $set: false },
            feedbacks: {
              [type]: {
                $set: {
                  judgment: feedback,
                  comment
                }
              }
            }
          }
        }
      }
    }
  });
};

const chatBlockItem = (state, { payload: { itemID, exclutedChat } }) => {
  const item = state.data[itemID];
  item.enabled = false;
  for (chatID in item.chats) {
    if (chatID == exclutedChat) continue;
    item.chats[chatID].status = ChatStatus.BLOCKED;
  }
  return update(state, {
    data: {
      [itemID]: { $set: item }
    }
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHAT_INIT:
      return chatInit(state, action);

    case actionTypes.CHAT_CLEAR:
      return chatClear(state, action);

    case actionTypes.CHAT_START_GLOBAL_ACTION:
      return chatStartGlobalAction(state, action);

    case actionTypes.CHAT_START_CHAT_ACTION:
      return chatStartChatAction(state, action);

    case actionTypes.CHAT_FAIL:
      return chatFail(state, action);

    case actionTypes.CHAT_SINGLE_FAIL:
      return chatSingleFail(state, action);

    case actionTypes.CHAT_SET_SALES_LIST_FOCUS:
      return chatSetSalesListFocus(state, action);

    case actionTypes.CHAT_SET_SHOPPING_LIST_FOCUS:
      return chatSetShoppingListFocus(state, action);

    case actionTypes.CHAT_SET_CHAT_FOCUS:
      return chatSetChatFocus(state, action);

    case actionTypes.CHAT_SET_COMPOSER:
      return chatSetComposer(state, action);

    case actionTypes.CHAT_RECEIVE_MSG:
      return chatReceiveMessage(state, action);

    case actionTypes.CHAT_SYSTEM_MSG:
      return chatSystemMsg(state, action);

    case actionTypes.CHAT_SEND_MSG:
      return chatSendMsg(state, action);

    case actionTypes.CHAT_CONFIRM_MSG:
      return chatConfirmMsg(state, action);

    case actionTypes.CHAT_ERROR_MSG:
      return chatErrorMsg(state, action);

    case actionTypes.CHAT_READ:
      return chatRead(state, action);

    case actionTypes.CHAT_SETTLE:
      return chatSettle(state, action);

    case actionTypes.CHAT_NEW_CHAT:
      return chatNewChat(state, action);

    case actionTypes.CHAT_START_STATUS_ACTION:
      return chatStartStatusAction(state, action);

    case actionTypes.CHAT_LOAD_EARLIER:
      return chatLoadEarlier(state, action);

    case actionTypes.CHAT_CONTACT_USER:
      return chatContactUser(state, action);

    case actionTypes.CHAT_NEW_OFFERT:
      return chatNewOffert(state, action);

    case actionTypes.CHAT_REMOVE_OFFERT:
      return chatRemoveOffert(state, action);

    case actionTypes.CHAT_ACCEPT_OFFERT:
      return chatAcceptOffert(state, action);

    case actionTypes.CHAT_OFFERT_FAIL:
      return chatOffertFail(state, action);

    case actionTypes.CHAT_NEW_ITEM:
      return chatNewItem(state, action);

    case actionTypes.CHAT_MODIFY_ITEM:
      return chatModifyItem(state, action);

    case actionTypes.CHAT_ONLINE:
      return chatStartGlobalAction(state, action);

    case actionTypes.CHAT_SET_FEEDBACK:
      return chatSetFeedback(state, action);

    case actionTypes.CHAT_BLOCK_ITEM:
      return chatBlockItem(state, action);

    default:
      return state;
  }
};

const formatSalesData = (arrayData, focus = 0) => {
  console.log("SALES: ", arrayData);

  let orderedData = [];
  let data = {};
  for (let i = 0; i < arrayData.length; i++) {
    const { chats, _id: itemID, seller, ...restItem } = arrayData[i];

    seller.office = formatOffice(seller.course);
    seller.course = null;

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
      buyer.course = null;

      for (let m = 0; m < chat.messages.length; m++)
        chat.messages[m].createdAt = new Date(chat.messages[m].createdAt);

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
      seller.course = null;

      const item = {
        ...restItem,
        seller
      };

      for (let m = 0; m < chat.messages.length; m++)
        chat.messages[m].createdAt = new Date(chat.messages[m].createdAt);

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
    shoppingFocus: focus
  };
};
