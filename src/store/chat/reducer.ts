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
  ShoppingData,
  InitSalesType,
  InitShoppingType,
  ChatInitAction,
  ChatStartGlobalActionAction,
  ChatStartChatActionAction,
  ChatFailAction,
  ChatSingleFail,
  ChatSetSalesListFocusAction,
  ChatSetShoppingListFocusAction,
  ChatSetChatFocusAction,
  ChatSetComposerAction,
  ChatReceiveMessageAction,
  ChatSystemMsgAction,
  ChatSendMsgAction,
  ChatConfirmMsgAction,
  ChatErrorMsg,
  ChatReadAction,
  ChatSettleActionAction,
  ChatNewChatAction,
  ChatStartStatusActionAction,
  ChatLoadEarlier,
  ChatContactUser,
  ChatNewItemAction,
  ChatModifyItemAction,
  ChatNewOffertAction,
  ChatRemoveOffertAction,
  ChatSetOffertAcceptedAction,
  ChatOffertFailAction,
  ChatSetFeedbackAction,
  ChatDisableItem,
  ChatOnlineAction,
  ChatCategorySecondaryType,
  GeneralChat
} from "./types";
import {
  getSubjectIndex,
  getItemIndex,
  highlightItem,
  createSystemMessage,
  createOffert
} from "../../utils/chatUtility";
import { formatOffice, formatUser } from "../../utils/helper";
import { GeneralUser } from "../../types/ProfileTypes";
import { GeneralItem } from "../../types/ItemTypes";

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

const chatInit = (
  state: ChatType,
  { payload: { salesData, shoppingData } }: ChatInitAction
): ChatType => {
  const { salesFormattedData, ...salesRest } = formatSalesData(salesData);
  const {
    shoppingFormattedData,
    contactedItems,
    ...shoppingRest
  } = formatShoppingData(shoppingData);

  return updateObject(state, {
    data: {
      ...salesFormattedData,
      ...shoppingFormattedData
    },
    ...salesRest,
    ...shoppingRest,
    contactedItems,
    loading: false
  });
};

const chatClear = (): ChatType => initialState;

const chatStartGlobalAction = (
  state: ChatType,
  action: ChatStartGlobalActionAction | ChatOnlineAction
): ChatType =>
  update(state, {
    loading: { $set: true }
  });

const chatStartChatAction = (
  state: ChatType,
  { payload: { objectID, chatID } }: ChatStartChatActionAction
) =>
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

const chatFail = (
  state: ChatType,
  { payload: { error } }: ChatFailAction
): ChatType =>
  update(state, {
    error: { $set: error },
    loading: { $set: false }
  });

const chatSingleFail = (
  state: ChatType,
  { payload: { objectID, chatID, error } }: ChatSingleFail
): ChatType =>
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

const chatSetSalesListFocus = (
  state: ChatType,
  { payload: { focus } }: ChatSetSalesListFocusAction
): ChatType =>
  update(state, {
    salesFocus: { $set: focus }
  });

const chatSetShoppingListFocus = (
  state: ChatType,
  { payload: { focus } }: ChatSetShoppingListFocusAction
): ChatType =>
  update(state, {
    shoppingFocus: { $set: focus }
  });

const chatSetChatFocus = (
  state: ChatType,
  { payload: { chatID } }: ChatSetChatFocusAction
): ChatType =>
  update(state, {
    chatFocus: { $set: chatID }
  });

const chatSetComposer = (
  state: ChatType,
  { payload: { objectID, chatID, value } }: ChatSetComposerAction
): ChatType =>
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
  state: ChatType,
  { payload: { objectID, chatID, msg, type } }: ChatReceiveMessageAction
): ChatType => {
  const orderedType =
    type === "sale" ? "salesOrderedData" : "shoppingOrderedData";
  const objectIndex =
    type === "sale"
      ? getItemIndex(objectID, state.salesOrderedData)
      : getSubjectIndex(objectID, state.shoppingOrderedData);
  const chatIndex = state[orderedType][objectIndex];
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
          $apply: oldNewsCount => (!hadNews ? oldNewsCount + 1 : oldNewsCount)
        }
      }
    },
    [orderedType]: {
      [objectIndex]: {
        chats: {
          $apply: (object: number) => {} //highlightItem(object, chatIndex)
        }
      }
    }
  });
};

const chatSystemMsg = (
  state: ChatType,
  { payload: { objectID, chatID, msg } }: ChatSystemMsgAction
): ChatType => {
  const type =
    String(objectID).charAt(0) === "s"
      ? ChatCategorySecondaryType.shopping
      : ChatCategorySecondaryType.sale;
  const messageData = createSystemMessage(msg);
  return chatReceiveMessage(state, {
    type: CHAT_RECEIVE_MSG,
    payload: { objectID, chatID, msg: messageData, type }
  });
};

const chatSendMsg = (
  state: ChatType,
  { payload: { objectID, chatID, msg, type } }: ChatSendMsgAction
): ChatType => {
  const orderedType =
    type === ChatCategoryType.sales
      ? "salesOrderedData"
      : "shoppingOrderedData";
  const objectIndex =
    type === ChatCategoryType.sales
      ? getItemIndex(objectID, state.salesOrderedData)
      : getSubjectIndex(objectID, state.shoppingOrderedData);

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
          $apply: (object: number) => null //highlightItem(object, chatIndex)
        }
      }
    }
  });
};

const chatConfirmMsg = (
  state: ChatType,
  { payload: { objectID, chatID, msgID, data } }: ChatConfirmMsgAction
): ChatType => {
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

const chatErrorMsg = (
  state: ChatType,
  { payload: { objectID, chatID, msgID } }: ChatErrorMsg
): ChatType => {
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

/*
{
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
*/

const chatRead = (
  state: ChatType,
  { payload: { objectID, chatID } }: ChatReadAction
): ChatType => {
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

const chatSettle = (
  state: ChatType,
  { payload: { objectID, chatID, status } }: ChatSettleActionAction
): ChatType =>
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

const chatNewChat = (
  state: ChatType,
  { payload: { objectID, chatID, data } }: ChatNewChatAction
): ChatType => {
  const { pk, ...restItem } = data.item;
  const UserTO = formatUser(data.buyer);

  const chat: GeneralChat = {
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
  const item: SalesData = {
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

const chatStartStatusAction = (
  state: ChatType,
  { payload: { objectID, chatID } }: ChatStartStatusActionAction
): ChatType =>
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
  state: ChatType,
  { payload: { objectID, chatID, data, toload } }: ChatLoadEarlier
): ChatType =>
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

const chatContactUser = (
  state: ChatType,
  { payload: { item, chatID } }: ChatContactUser
): ChatType => {
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
    contactedItems: {
      [item.pk]: { $set: true }
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

const chatNewItem = (
  state: ChatType,
  { payload: { item } }: ChatNewItemAction
): ChatType => {
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

const chatModifyItem = (
  state: ChatType,
  { payload: { item } }: ChatModifyItemAction
): ChatType => {
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
  state: ChatType,
  { payload: { objectID, chatID, price, pk, user } }: ChatNewOffertAction
): ChatType => {
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

const chatRemoveOffert = (
  state: ChatType,
  { payload: { objectID, chatID } }: ChatRemoveOffertAction
): ChatType => {
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

const chatAcceptOffert = (
  state: ChatType,
  { payload: { objectID, chatID } }: ChatSetOffertAcceptedAction
): ChatType =>
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

const chatOffertFail = (
  state: ChatType,
  { payload: { objectID, chatID, error } }: ChatOffertFailAction
): ChatType =>
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
  state: ChatType,
  {
    payload: { objectID, chatID, feedback, comment, fromWS }
  }: ChatSetFeedbackAction
): ChatType => {
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

const chatDisableItem = (
  state: ChatType,
  { payload: { type, objectID, chatID } }: ChatDisableItem
): ChatType => {
  if (type == ChatCategoryType.sales) {
    return update(state, {
      data: {
        [objectID]: {
          enabled: { $set: false }
        }
      }
    });
  } else {
    return update(state, {
      data: {
        [objectID]: {
          chats: {
            [chatID]: {
              item: {
                enabled: { $set: false }
              }
            }
          }
        }
      }
    });
  }
};

export default (state = initialState, action: TChatActions): ChatType => {
  switch (action.type) {
    case CHAT_INIT:
      return chatInit(state, action);

    case CHAT_CLEAR:
      return chatClear();

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

const formatSalesData = (arrayData: InitSalesType[], focus = 0) => {
  console.log("SALES: ", arrayData);

  let orderedData = [];
  let data: { [key: string]: SalesData } = {};
  for (let i = 0; i < arrayData.length; i++) {
    const { chats, _id: itemID, seller, ...restItem } = arrayData[i];

    //seller.office = formatOffice(seller.course);
    //delete seller.course;

    data[itemID] = {
      _id: itemID,
      seller: {
        ...seller,
        office: formatOffice(seller.course)
      },
      ...restItem,
      chats: {}
    };
    let orderedChats = [];
    for (let f = 0; f < chats.length; f++) {
      const { buyer, ...chat } = chats[f];
      orderedChats.push(chat._id);
      //buyer.office = formatOffice(buyer.course);
      //delete buyer.course;

      //for (let m = 0; m < chat.messages.length; m++)
      //  chat.messages[m].createdAt = new Date(chat.messages[m].createdAt);

      data[itemID].chats[chat._id] = {
        UserTO: {
          ...buyer,
          office: formatOffice(buyer.course)
        },
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

const formatShoppingData = (arrayData: InitShoppingType[], focus = 0) => {
  console.log("SHOPPING: ", arrayData);
  let orderedData = [];
  let data: { [key: string]: ShoppingData } = {};
  let contactedItems: { [key: number]: boolean } = {};
  for (let i = 0; i < arrayData.length; i++) {
    const { subject, items } = arrayData[i];

    data["s" + subject._id] = {
      _id: "s" + subject._id,
      title: subject.title,
      newsCount: 0, //Bug
      chats: {}
    };
    let orderedChats = [];
    for (let f = 0; f < items.length; f++) {
      const { chats: chat, seller: sellerSerializer, ...restItem } = items[f];
      orderedChats.push(chat._id);
      const seller: GeneralUser = {
        ...sellerSerializer,
        office: formatOffice(sellerSerializer.course)
      };

      const item: GeneralItem = {
        pk: restItem._id,
        comment_ad: [],
        description: "",
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
