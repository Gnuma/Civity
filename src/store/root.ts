import AsyncStorage from "@react-native-community/async-storage";
/** Types */
import { SearchType } from "./search/types";
import { AuthType } from "./auth/types";
//import { SellType } from "./sell_Deprecated/types";
import { SellType } from "./sell/types";
import { CommentsType } from "./comments/types";
import { ChatStructure } from "./chat/types";
import { SettingsType } from "./settings/types";
/** Reducers */
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

import authReducer from "./auth/reducer";
import searchReducer from "./search/reducer";

//import sellReducer from "./sell_Deprecated/reducer";
import sellReducer from "./sell/reducer";
import commentsReducer from "./comments/reducer";
import chatReducer from "./chat/reducer";
import settingsReducer from "./settings/reducer";

/** Epics */
import { searchEpics } from "./search";
import { chatEpics } from "./chat";
import { settingsEpics } from "./settings";
import { authEpics } from "./auth";
import { persistReducer } from "redux-persist";

export interface StoreType {
  search: SearchType;
  auth: AuthType;
  sell: SellType;
  comments: CommentsType;
  chat: ChatStructure;
  settings: SettingsType;
}

const chatPersistConfig = {
  key: "chat",
  storage: AsyncStorage,
  blacklist: ["state"]
};

export const rootReducer = combineReducers({
  search: searchReducer,
  auth: authReducer,
  sell: sellReducer,
  comments: commentsReducer,
  //chat: persistReducer(chatPersistConfig, chatReducer),
  chat: chatReducer,
  settings: settingsReducer
});

export const rootEpic = combineEpics(
  ...searchEpics,
  ...chatEpics,
  ...settingsEpics,
  ...authEpics
);
