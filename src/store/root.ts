/** Types */
import { SearchType } from "./search/types";
import { AuthType } from "./auth/types";
import { SellType } from "./sell/types";
import { CommentsType } from "./comments/types";
import { ChatType } from "./chat/types";
import { SettingsType } from "./settings/types";
/** Reducers */
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";

import authReducer from "./auth/reducer";
import searchReducer from "./search/reducer";

import sellReducer from "./sell/reducer";
import commentsReducer from "./comments/reducer";
import chatReducer from "./chat/reducer";
import settingsReducer from "./settings/reducer";

/** Epics */
import { searchEpics } from "./search";
import { chatEpics } from "./chat";
import { settingsEpics } from "./settings";

export interface StoreType {
  search: SearchType;
  auth: AuthType;
  sell: SellType;
  comments: CommentsType;
  chat: ChatType;
  settings: SettingsType;
}

export const rootReducer = combineReducers({
  search: searchReducer,
  auth: authReducer,
  sell: sellReducer,
  comments: commentsReducer,
  chat: chatReducer,
  settings: settingsReducer
});

export const rootEpic = combineEpics(
  ...searchEpics,
  ...chatEpics,
  ...settingsEpics
);
