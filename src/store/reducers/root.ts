import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import searchReducer from "./search";
import authReducer from "./auth";
import sellReducer from "./sell";
import notificationsReducer from "./notifications";
import salesReducer from "./sales";
import shoppingReducer from "./shopping";
import commentsReducer from "./comments";
import chatReducer from "./chat";
import settingsReducer from "./settings";

export const rootReducer = combineReducers({
  search: searchReducer,
  auth: authReducer,
  sell: sellReducer,
  comments: commentsReducer,
  chat: chatReducer,
  settings: settingsReducer
});

import { searchEpics } from "../actions/search";
import { chatEpics } from "../actions/chat";
import { settingsEpics } from "../actions/settings";
import StoreType from "../types/storeType";

export const rootEpic = combineEpics(
  ...searchEpics,
  ...chatEpics,
  ...settingsEpics
);
