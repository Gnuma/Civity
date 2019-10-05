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

import sellReducer from "./reducers/sell";
import commentsReducer from "./reducers/comments";
import chatReducer from "./reducers/chat";
import settingsReducer from "./reducers/settings";

/** Epics */
import { searchEpics } from "./actions/search";
import { chatEpics } from "../actions/auth";
import { settingsEpics } from "./actions/settings";

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
