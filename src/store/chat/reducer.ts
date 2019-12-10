import { updateObject } from "../utility";
import update from "immutability-helper";
import {
  ChatStructure,
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
import { generateChatData } from "../../utils/testingHelpers";

const testData = generateChatData(4);

const initialState: ChatStructure = {
  data: testData.data,
  chatOrder: testData.chatOrder,
  error: undefined,
  state: ChatState.DISCONNECTED
};

const chatConnect = (
  state: ChatStructure,
  action: ChatConnectAction
): ChatStructure => {
  return updateObject(state, {
    state: ChatState.CONNECTED
  });
};

const chatDisconnect = (
  state: ChatStructure,
  action: ChatDisconnectAction
): ChatStructure => {
  return updateObject(state, {
    state: ChatState.DISCONNECTED
  });
};

const chatBuffer = (
  state: ChatStructure,
  action: ChatBufferAction
): ChatStructure =>
  updateObject(state, {
    state: ChatState.BUFFER
  });

const chatFail = (
  state: ChatStructure,
  action: ChatFailAction
): ChatStructure =>
  updateObject(state, {
    error: action.payload.error
  });

const chatResume = (
  state: ChatStructure,
  action: ChatResumeAction
): ChatStructure =>
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

export default (state = initialState, action: TChatActions): ChatStructure => {
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
