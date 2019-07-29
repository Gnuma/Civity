import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatView from "../components/Chat/Chat";
import { single } from "../mockData/Chat2";
import * as chatActions from "../store/actions/chat";
import * as messagingAction from "../store/actions/messaging";
import ContactReview from "../components/Chat/ContactReview";
import { ChatType, ChatStatus } from "../utils/constants";

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

  render() {
    const { objectID, chatID } = this.state;
    const chatData = this.props.chatData;
    const item = this.props.item;

    return (
      <View style={{ flex: 1 }}>
        <ChatHeader
          data={chatData}
          item={item}
          goBack={this._goBack}
          goBookOffert={this.goBookOffert}
        />
        <View style={{ flex: 1, marginTop: 120 }}>
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
