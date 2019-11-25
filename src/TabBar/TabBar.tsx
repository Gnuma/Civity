import React, { Component } from "react";
import {
  View,
  Platform,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  KeyboardEventListener,
  EmitterSubscription,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "../components/Button";

import ChatIcon from "../media/vectors/ChatIcon";
import SearchIcon from "../media/vectors/SearchIcon";
import CivitySquareIcon from "../media/vectors/CivitySquareIcon";

import { Header4 } from "../components/Text";
import colors from "../styles/colors";
import Shadows from "../components/Shadows";
import { BottomTabBarProps } from "react-navigation-tabs/lib/typescript/src/types";
import { StoreType } from "../store/root";

export class TabBar extends Component<BottomTabBarProps> {
  static propTypes = {};

  keyboardEventListeners: EmitterSubscription[] = [];

  state = {
    visible: true
  };

  componentDidMount() {
    if (Platform.OS === "android") {
      this.keyboardEventListeners = [
        Keyboard.addListener("keyboardDidShow", this.visible(false)),
        Keyboard.addListener("keyboardDidHide", this.visible(true))
      ];
    }
  }

  componentWillUnmount() {
    this.keyboardEventListeners &&
      this.keyboardEventListeners.forEach(
        (eventListener: EmitterSubscription) => eventListener.remove()
      );
  }

  visible = (visible: boolean) => () => this.setState({ visible });

  render() {
    if (!this.state.visible) return null;

    const focus = this._getFocused();
    return (
      <SafeAreaView
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          ...Shadows[2]
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            minHeight: 60
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={this._goHome}
          >
            <SearchIcon
              color={focus === "SEARCH" ? colors.secondary : colors.grey}
              size={25}
            />
            <Header4 color={focus === "SEARCH" ? "secondary" : "grey"}>
              Esplora
            </Header4>
          </TouchableOpacity>
          <Button
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={this._goSell}
          >
            <CivitySquareIcon
              color={focus === "SELL" ? colors.secondary : colors.grey}
              size={25}
            />
            <Header4 color={focus === "SELL" ? "secondary" : "grey"}>
              Vendi
            </Header4>
          </Button>
          <Button
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={this._goUser}
          >
            <ChatIcon
              color={focus === "CHAT" ? colors.secondary : colors.grey}
              size={25}
            ></ChatIcon>
            <Header4 color={focus === "CHAT" ? "secondary" : "grey"}>
              Chat
            </Header4>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  _getFocused = () => {
    return this.props.navigation.state.routes[this.props.navigation.state.index]
      .routeName;
  };

  _goHome = () => {
    this.props.navigation.navigate("SEARCH");
  };
  _goSell = () => {
    this.props.navigation.navigate("SELL");
  };
  _goUser = () => {
    this.props.navigation.navigate("CHAT");
  };
}

const mapStateToProps = (state: StoreType) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);

const styles = StyleSheet.create({
  hasNotification: {
    borderBottomWidth: 1,
    borderColor: colors.darkRed
  }
});
