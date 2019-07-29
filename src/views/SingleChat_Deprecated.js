import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GiftedChat } from "react-native-gifted-chat";
import { chats } from "../mockData/Chat";
import ChatHeader from "../components/Chat_Deprecated/ChatHeader";
import Chat from "../components/Chat_Deprecated/Chat";

export class SingleChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  setStatus = value => {
    this.setState(
      {
        status: value
      },
      () => {
        if (value === 1) {
          this.setState(previousState => ({
            messages: GiftedChat.prepend(previousState.messages, [
              "Ricorda che Federico non riceverà i tuoi messaggi finche non accetterà la conversazione",
              "Perfetto! Inzia la conversazione semplicemente salutando",
              "Tempo di risposta medio 1h"
            ])
          }));
        }
      }
    );
  };

  get user() {
    return {
      name: this.props.userUsername,
      _id: this.props.userID
    };
  }

  render() {
    const { messages, status, navigation } = this.props;
    const { to, id: chatID, userType } = navigation.getParam("data", "null");
    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ChatHeader data={chats[0]} handleGoBack={this.handleGoBack} />
        <Chat
          user={this.user}
          status={status}
          isLoading={isLoading}
          messages={messages}
          chatID={chatID}
          userType={userType}
          //onSend={Fire.shared.send}
          //setStatus={this.setStatus}
        />
      </View>
    );
  }

  handleGoBack = () => {
    this.props.navigation.goBack(null);
  };
}

const mapStateToProps = (state, props) => {
  const navProps = props.navigation.getParam("data", "null");
  return {};
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleChat);

/*

  onLoadEarlier = () => {
    this.setState({
      isLoadingEarlier: true
    });

    setTimeout(() => {
      if (true) {
        this.setState(previousState => {
          return {
            messages: GiftedChat.prepend(previousState.messages, oldMockChat),
            loadEarlier: false,
            isLoadingEarlier: false
          };
        });
      }
    }, 1000); // simulating network
  };

  onSend = (messages = []) => {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages)
      };
    });
  };
  */

/*
    componentDidMount() {
    const status = this.props.navigation.getParam("status", 2);
    if (status === 2) {
      Fire.shared.on(message =>
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message)
        }))
      );
    } else {
      this.setState({
        status
      });
    }
  }

  componentWillUnmount() {
    Fire.shared.off();
  }

  get user() {
    return {
      name: "Federico",
      _id: Fire.shared.uid
    };
  }
  */
