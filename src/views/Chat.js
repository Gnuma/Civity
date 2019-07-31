import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ChatView from "../components/Chat/Chat";
import * as chatActions from "../store/actions/chat";
import ContactReview from "../components/Chat/ContactReview";
import { ChatType, ChatStatus } from "../utils/constants";
import ScrollHeader from "../components/ScrollHeader";
import { Header1 } from "../components/Text";
import ListMultiItem from "../components/ListItem/ListMultiItem";
import { UserCard, OffertCard } from "../components/BookOffert/General";
import { pickOffert } from "./BookOffert";
import NativeGoBack from "../components/NativeGoBack";
import FullButton from "../components/FullButton";
import colors from "../styles/colors";

export class Chat extends Component {
  constructor(props) {
    super(props);

    const itemID = props.navigation.getParam("itemID", null);
    const subjectID = props.navigation.getParam("subjectID", null);
    const chatID = props.navigation.getParam("chatID", null);

    this.type = itemID !== null ? ChatType.sales : ChatType.shopping;
    this.firstFocus = false;

    this.state = {
      objectID: this.type === ChatType.sales ? itemID : subjectID,
      chatID
    };
  }

  static propTypes = {};

  componentDidMount() {
    this.setChatFocus(true);
    //this.readChat(this.state.objectID, this.state.chatID);
    const { navigation } = this.props;
    this.focusListeners = [
      navigation.addListener("didFocus", () => {
        this.firstFocus && this.setChatFocus(true);
        this.firstFocus = true;
      }),
      navigation.addListener("didBlur", () => this.setChatFocus(false))
    ];
  }

  componentWillUnmount() {
    this.focusListeners.forEach(element => {
      element.remove();
    });
    this.setChatFocus(false);
  }

  setChatFocus = isFocused => {
    const chatID = isFocused ? this.state.chatID : null;
    this.props.chatSetChatFocus(this.state.objectID, chatID);
  };

  goBookOffert = () => {
    this.props.navigation.navigate("BookOffert", {
      objectID: this.state.objectID,
      chatID: this.state.chatID,
      type: this.type
    });
  };

  setComposer = (objectID, chatID, composerValue) => {
    this.props.chatSetComposer(objectID, chatID, composerValue);
  };

  sendMsg = (objectID, chatID) => {
    this.props.sendMessage(this.type, objectID, chatID);
  };

  loadEarlier = () => {
    this.props.chatLoadEarlier(this.state.objectID, this.state.chatID);
  };

  renderHeaderContent = () => {
    const { item, chatData } = this.props;
    const { UserTO: user } = chatData;
    const offert = pickOffert(chatData.offerts);

    return (
      <View>
        {offert && <OffertCard offert={offert} />}
        {user && <UserCard userData={user} />}
        <View style={{ marginTop: -10 }}>
          <ListMultiItem
            data={item}
            isSingle={false}
            pk={item._id}
            native={true}
          />
        </View>
      </View>
    );
  };

  renderHeader = () => {
    const chatData = this.props.chatData;
    return (
      <View
        style={[
          {
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.white
          }
        ]}
      >
        <NativeGoBack goBack={this._goBack} />
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Header1 color={"primary"} style={{ flex: 1 }} numberOfLines={1}>
            {chatData.UserTO.user.username}
          </Header1>
          <FullButton value="Test" style={{ marginHorizontal: 10 }} />
        </View>
      </View>
    );
  };

  render() {
    const { objectID, chatID } = this.state;
    const chatData = this.props.chatData;
    const item = this.props.item;

    return (
      <View style={{ flex: 1 }}>
        <ScrollHeader
          minHeight={60}
          renderContent={this.renderHeaderContent}
          renderHeader={this.renderHeader}
        />
        <View style={{ flex: 1, marginTop: 60, zIndex: 0 }}>
          {chatData.status === ChatStatus.LOCAL ||
          chatData.status === ChatStatus.PENDING ? (
            <ContactReview
              objectID={objectID}
              chatID={chatID}
              status={chatData.status}
              isLoading={chatData.loading}
              onSettle={this.props.chatSettle}
              onContactRequest={this.props.chatRequestContact}
              username={chatData.UserTO.user.username}
              type={this.type}
            />
          ) : (
            <ChatView
              objectID={objectID}
              chatID={chatID}
              data={chatData}
              globalLoading={this.props.loading}
              salesSend={this.sendMsg}
              salesSetComposer={this.setComposer}
              type={this.type}
              loadEarlier={this.loadEarlier}
              userID={this.props.userID}
              item={item}
              goBookOffert={this.goBookOffert}
            />
          )}
        </View>
      </View>
    );
  }

  _goBack = () => {
    this.props.navigation.goBack(null);
  };
}

const mapStateToProps = (state, { navigation }) => {
  const itemID = navigation.getParam("itemID", null);
  const subjectID = navigation.getParam("subjectID", null);
  const chatID = navigation.getParam("chatID", null);
  const type = itemID !== null ? ChatType.sales : ChatType.shopping;
  const objectID = type === ChatType.sales ? itemID : subjectID;
  const chatData = state.chat.data[objectID].chats[chatID];
  let item;
  if (type == ChatType.sales) {
    const { chats, ...itemData } = state.chat.data[objectID];
    item = itemData;
  } else {
    item = chatData.item;
  }

  return {
    userID: state.auth.id,
    chatData,
    loading: state.chat.loading,
    item
  };
};

const mapDispatchToProps = dispatch => ({
  sendMessage: (type, objectID, chatID) =>
    dispatch(chatActions.chatSend(type, objectID, chatID)),
  chatSetComposer: (objectID, chatID, composer) =>
    dispatch(chatActions.chatSetComposer(objectID, chatID, composer)),
  chatSettle: (objectID, chatID, isAccepting) =>
    dispatch(chatActions.chatSettle(objectID, chatID, isAccepting)),
  chatRequestContact: (objectID, chatID) =>
    dispatch(chatActions.chatRequestContact(objectID, chatID)),
  chatSetChatFocus: (objectID, chatID) =>
    dispatch(chatActions.chatSetChatFocus(objectID, chatID)),
  chatLoadEarlier: (objectID, chatID) =>
    dispatch(chatActions.chatLoadEarlier(objectID, chatID))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);

/*
        <ChatHeader
          data={chatData}
          item={item}
          goBack={this._goBack}
          goBookOffert={this.goBookOffert}
          userID={this.props.userID}
        />
        */
