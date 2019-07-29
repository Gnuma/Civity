import { NavigationActions, StackActions } from "react-navigation";
import store from "../store/store";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params, key) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
      key
    })
  );
}

function dispatch(action) {
  _navigator.dispatch(action);
}

function push(routeName, params, key) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params,
      key
    })
  );
}

function goBack(key) {
  if (!key) _navigator.dispatch(NavigationActions.back());
  else _navigator.dispatch(NavigationActions.back(key));
}

/**
 * @deprecated Since new AUTH
 */
function protectedNavigation(routeName, routeParams, ___CALLBACK___) {
  const isAuthenticated = store.getState().auth.token;
  if (isAuthenticated) navigate(routeName, routeParams);
  else {
    _navigator.dispatch(
      NavigationActions.setParams({
        params: {
          ___routeName___: routeName,
          ___routeParams___: routeParams,
          ___CALLBACK___
        },
        key: "startingAuth"
      })
    );
    navigate("AUTH", null, "startingAuth");
  }
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  protectedNavigation,
  goBack,
  dispatch,
  push
};
