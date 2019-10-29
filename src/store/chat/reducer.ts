import { updateObject } from "../utility";
import update from "immutability-helper";
import {
  ChatType,
  TChatActions,
  CHAT_CONNECT,
  ChatState,
  ChatConnectAction,
  ChatDisconnectAction,
  CHAT_DISCONNECT,
  ChatBufferAction,
  CHAT_BUFFER,
  ChatFailAction,
  CHAT_FAIL,
  ChatResumeAction,
  ChatDataType,
  ResumeMessages,
  CHAT_RESUME
} from "./types";

const initialState: ChatType = {
  data: {
    //Test
  },
  error: undefined,
  state: ChatState.DISCONNECTED
};

const chatConnect = (state: ChatType, action: ChatConnectAction): ChatType => {
  return updateObject(state, {
    state: ChatState.CONNECTED
  });
};

const chatDisconnect = (
  state: ChatType,
  action: ChatDisconnectAction
): ChatType => {
  return updateObject(state, {
    state: ChatState.DISCONNECTED
  });
};

const chatBuffer = (state: ChatType, action: ChatBufferAction): ChatType =>
  updateObject(state, {
    state: ChatState.BUFFER
  });

const chatFail = (state: ChatType, action: ChatFailAction): ChatType =>
  updateObject(state, {
    error: action.payload.error
  });

const chatResume = (state: ChatType, action: ChatResumeAction): ChatType =>
  update(state, {
    data: {
      $apply: (data: ChatDataType) => {
        action.payload.data.forEach((chatResumeData: ResumeMessages) => {
          data[chatResumeData.id].messages.push(...chatResumeData.messages);
        });
        return data;
      }
    }
  });

export default (state = initialState, action: TChatActions): ChatType => {
  switch (action.type) {
    case CHAT_CONNECT:
      return chatConnect(state, action);

    case CHAT_DISCONNECT:
      return chatDisconnect(state, action);

    case CHAT_BUFFER:
      return chatBuffer(state, action);

    case CHAT_FAIL:
      return chatFail(state, action);

    case CHAT_RESUME:
      return chatResume(state, action);

    default:
      return state;
  }
};
