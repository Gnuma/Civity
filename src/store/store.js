import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { createEpicMiddleware } from "redux-observable";
import promise from "redux-promise-middleware";
import { rootReducer, rootEpic } from "./reducers/root";

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware();

const store = createStore(
  rootReducer,
  composeEnhances(applyMiddleware(thunk, promise, epicMiddleware))
);

epicMiddleware.run(rootEpic);

export default store;
