import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { createEpicMiddleware } from "redux-observable";
import promise from "redux-promise-middleware";
import { persistStore, persistReducer } from "redux-persist";
import { rootReducer, rootEpic } from "./root";
import AsyncStorage from "@react-native-community/async-storage";
import hardSet from "redux-persist/lib/stateReconciler/hardSet";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: hardSet,
  blacklist: ["chat", "sell"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware();

const store = createStore(
  persistedReducer,
  composeEnhances(applyMiddleware(thunk, promise, epicMiddleware))
);

epicMiddleware.run(rootEpic);

export const persistor = persistStore(store);

export default store;
