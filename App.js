import React, { Component } from "react";
import { View, Text, AppState } from "react-native";
import { Provider, connect } from "react-redux";
import store from "./src/store/store";
import Navigator, {
  loadNavigationState,
  persistNavigationState
} from "./src/navigator/Navigator";
import NavigationService from "./src/navigator/NavigationService";
import WS from "./src/utils/WebSocket";
import axios from "axios";
import Notification from "./src/utils/Notifications";
import firebase from "react-native-firebase";
import { Header2 } from "./src/components/Text";

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
        <Navigator
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          persistNavigationState={persistNavigationState}
          loadNavigationState={loadNavigationState}
        />
      </Provider>
    );
  }
}

export default App;

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
