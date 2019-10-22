import React, { Component } from "react";
import {
  View,
  Platform,
  Keyboard,
  StyleSheet,
  SafeAreaView,
  KeyboardEventListener,
  EmitterSubscription
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "../components/Button";
import SellIcon from "../media/vectors/sell-icon";
import Icon from "react-native-vector-icons/FontAwesome";
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
          <Button
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={this._goHome}
          >
            <Icon
              name="search"
              size={20}
              style={{
                marginBottom: 5,
                color: focus === "SEARCH" ? colors.secondary : colors.grey
              }}
            />
            <Header4 color={focus === "SEARCH" ? "secondary" : "grey"}>
              Esplora
            </Header4>
          </Button>
          <Button
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={this._goChat}
          >
            <SellIcon
              style={{ marginBottom: 5 }}
              color={focus === "CHAT" ? colors.secondary : colors.grey}
              width={"20em"}
              height={"20em"}
            />
            <Header4 color={focus === "CHAT" ? "secondary" : "grey"}>
              Chat
            </Header4>
          </Button>
          <Button
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={this._goUser}
          >
            <Icon
              name="tags"
              size={20}
              style={{
                marginBottom: 5,
                color: focus === "USER" ? colors.secondary : colors.grey
              }}
            />
            <Header4 color={focus === "USER" ? "secondary" : "grey"}>
              Profilo
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
  _goChat = () => {
    this.props.navigation.navigate("CHAT");
  };
  _goUser = () => {
    this.props.navigation.navigate("USER");
  };
}

const mapStateToProps = (state: StoreType) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabBar);

const styles = StyleSheet.create({
  hasNotification: {
    borderBottomWidth: 1,
    borderColor: colors.darkRed
  }
});
