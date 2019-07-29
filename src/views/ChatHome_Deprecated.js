import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { chats } from "../mockData/Chat";
import HomeHeader from "../components/Chat_Deprecated/HomeHeader";
import BasicHeader from "../components/BasicHeader";
import ChatsList from "../components/Chat_Deprecated/ChatsList";
export class ChatHome extends Component {
  render() {
    const { sellerChats, buyerChats } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <BasicHeader title="Chat" />
        <ChatsList
          sellerChatsData={sellerChats}
          buyerChatsData={buyerChats}
          inspectChat={this.inspectChat}
          handleGoBack={this._handleGoBack}
        />
      </View>
    );
  }

  inspectChat = data => {
    this.props.navigation.navigate("ChatSingle", {
      data
    });
  };

  _handleGoBack = () => {
    this.props.navigation.goBack(null);
  };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatHome);
