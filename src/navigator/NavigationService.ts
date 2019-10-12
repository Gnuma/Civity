import {
  NavigationActions,
  StackActions,
  NavigationBackActionPayload
} from "react-navigation";
import store from "../store/store";

let _navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: string, params?: object, key?: string) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
      key
    })
  );
}

function dispatch(action: any) {
  _navigator.dispatch(action);
}

function push(routeName: string, params?: object, key?: string) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params,
      key
    })
  );
}

function goBack(key: NavigationBackActionPayload) {
  if (!key) _navigator.dispatch(NavigationActions.back());
  else _navigator.dispatch(NavigationActions.back(key));
}

/**
 * @deprecated Since new AUTH
 */
function protectedNavigation(
  routeName: string,
  routeParams?: object,
  ___CALLBACK___?: any
) {
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
    navigate("AUTH", undefined, "startingAuth");
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
