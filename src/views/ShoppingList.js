import React, { Component } from "react";
import { View, Text, StatusBar } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Header3 } from "../components/Text";
import ShoppingTab from "../components/Shopping/ShoppingTab";
import * as searchActions from "../store/actions/search";
import * as chatActions from "../store/actions/chat";
import ShoppingChatsList from "../components/Shopping/ShoppingChatsList";
import SearchLink from "../components/Home/SearchLink";
import _ from "lodash";
import colors from "../styles/colors";
import OfflineView, { OfflineNotification } from "../components/OfflineView";
import { IS_ANDROID } from "../utils/constants";
import { SafeAreaView } from "react-navigation";

export class ShoppingList extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    focus: PropTypes.number,
    setShoppingFocus: PropTypes.func,
    data: PropTypes.object,
    orderedData: PropTypes.array
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("willFocus", () => {
      StatusBar.setBarStyle(IS_ANDROID ? "light-content" : "dark-content");
      IS_ANDROID && StatusBar.setBackgroundColor(colors.lightGrey);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  render() {
    const {
      data,
      orderedData,
      focus,
      setShoppingFocus,
      isAuthenticated,
      delayedLogin,
      isConnected
    } = this.props;

    if (delayedLogin) return <OfflineView shopping />;

    if (!orderedData || _.isEmpty(orderedData)) return this.renderEmpty();

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <ShoppingTab
            goTo={setShoppingFocus}
            isAuthenticated={isAuthenticated}
            data={data}
            orderedData={orderedData}
            focus={focus}
          />
          <ShoppingChatsList
            isAuthenticated={isAuthenticated}
            data={data}
            orderedData={orderedData}
            focus={focus}
            onGoChat={this.onGoChat}
          />
          {!isConnected && (
            <View
              style={{ position: "absolute", bottom: 0, left: 20, right: 20 }}
            >
              <OfflineNotification />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  onGoChat = (subjectID, chatID) => {
    this.props.navigation.navigate("ShoppingChat", {
      subjectID,
      chatID
    });
  };

  renderEmpty = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            marginVertical: 20,
            marginHorizontal: 20
          }}
        >
          <Header3 color="black">
            Sembra che tu non abbia ancora contattato nessun venditore
          </Header3>
          <View style={{ flex: 1 / 3, justifyContent: "center" }}>
            <SearchLink onPress={this.goSearch} />
          </View>
          {!this.props.isConnected && (
            <View
              style={{ position: "absolute", bottom: -20, left: 0, right: 0 }}
            >
              <OfflineNotification />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  };

  goSearch = () => {
    this.props.navigation.navigate("Home");
    this.props.setSearchActive(true);
  };
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null,
  focus: state.chat.shoppingFocus,
  data: state.chat.data,
  orderedData: state.chat.shoppingOrderedData,
  delayedLogin: state.auth.delayedLogin,
  isConnected: state.settings.isConnected
});

const mapDispatchToProps = dispatch => ({
  setShoppingFocus: focus =>
    dispatch(chatActions.chatSetShoppingListFocus(focus)),
  setSearchActive: isActive => dispatch(searchActions.searchSetActive(isActive))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShoppingList);
