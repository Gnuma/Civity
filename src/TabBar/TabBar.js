import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  Keyboard,
  StyleSheet,
  SafeAreaView
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "../components/Button";
import SellIcon from "../media/vectors/sell-icon";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header4 } from "../components/Text";
import colors from "../styles/colors";
import NavigationService from "../navigator/NavigationService";
import protectedAction from "../utils/protectedAction";
import firebase from "react-native-firebase";
import Shadows from "../components/Shadows";

export class TabBar extends Component {
  static propTypes = {};

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
      this.keyboardEventListeners.forEach(eventListener =>
        eventListener.remove()
      );
  }

  visible = visible => () => this.setState({ visible });

  render() {
    if (!this.state.visible) return null;

    const { navigation } = this.props;
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
            onPress={this._goVendi}
          >
            <SellIcon
              style={{ marginBottom: 5 }}
              color={focus === "SALES" ? colors.secondary : colors.grey}
              width={"20em"}
              height={"20em"}
            />
            <Header4
              color={focus === "SALES" ? "secondary" : "grey"}
              style={this.props.salesNews && styles.hasNotification}
            >
              Vendi
            </Header4>
          </Button>
          <Button
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={this._goShopping}
          >
            <Icon
              name="tags"
              size={20}
              style={{
                marginBottom: 5,
                color: focus === "SHOPPING" ? colors.secondary : colors.grey
              }}
            />
            <Header4
              color={focus === "SHOPPING" ? "secondary" : "grey"}
              style={this.props.shoppingNews && styles.hasNotification}
            >
              Acquisti
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
  _goVendi = () => {
    this.props.navigation.navigate("SALES");
  };
  _goShopping = () => {
    this.props.navigation.navigate("SHOPPING");
  };
}

const mapStateToProps = state => {
  let salesNews = false;
  let shoppingNews = false;

  /*
  for (const objectID in state.chat.data) {
    if (
      state.chat.data.hasOwnProperty(objectID) &&
      state.chat.data[objectID].newsCount > 0
    ) {
      if (String(objectID).charAt(0) === "s") shoppingNews = true;
      else salesNews = true;
    }
  }
  */

  return {
    salesNews,
    shoppingNews
  };
};

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
