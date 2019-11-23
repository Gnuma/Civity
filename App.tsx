import React, { Component } from "react";
import { View, Text, AppState } from "react-native";
import { Provider, connect } from "react-redux";
import store, { persistor } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import Navigator, {
  loadNavigationState,
  persistNavigationState
} from "./src/navigator/Navigator";
import NavigationService from "./src/navigator/NavigationService";
import axios from "axios";
import Notification from "./src/utils/Notifications";
import firebase from "react-native-firebase";
import { Header2 } from "./src/components/Text";
import SplashScreen from "./src/components/SplashScreen";
import { ___WS_TEST_ENDPOINT } from "./src/store/endpoints";
//import MockWS from "./src/utils/MockWS";

//MockWS.init();

class App extends Component {
  componentDidMount() {
    Notification.start();
  }

  componentWillUnmount() {
    Notification.die();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <Navigator
            ref={(navigatorRef: any) => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
            persistNavigationState={persistNavigationState}
            loadNavigationState={loadNavigationState}
          />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
