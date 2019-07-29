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

  getData = () => {
    console.log(this.props.data);
    return this.props.data;
  };

  getChatData = () => {
    console.log(this.getData()[this.state.objectID].chats[this.state.chatID]);
    return this.getData()[this.state.objectID].chats[this.state.chatID];
  };

  setComposer = (objectID, chatID, composerValue) => {
    this.props.chatSetComposer(objectID, chatID, composerValue);
  };

  sendMsg = (objectID, chatID) => {
    this.props.sendMessage(this.type, objectID, chatID);
  };

  //readChat = (objectID, chatID) => {
  //  this.props.readChat(objectID, chatID);
  //};

  getItem = () => {
    if (this.type === ChatType.sales) {
      return this.getData()[this.state.objectID];
    } else {
      return this.getData()[this.state.objectID].chats[this.state.chatID].item;
    }
  };

  loadEarlier = () => {
    this.props.chatLoadEarlier(this.state.objectID, this.state.chatID);
  };

  render() {
    const { objectID, chatID } = this.state;
    const chatData = this.getChatData();
    const item = this.getItem();

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

const mapStateToProps = state => ({
  data: state.chat.data,
  loading: state.chat.loading,
  userID: state.auth.id
});

const mapDispatchToProps = dispatch => ({
  //new
  //readChat: (objectID, chatID) =>
  //  dispatch(chatActions.chatRead(objectID, chatID)),
  //sendMessage: (type, objectID, chatID) =>
  //  dispatch(messagingAction.sendMessage(type, objectID, chatID)),
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
