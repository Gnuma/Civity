import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import ScrollHeader from "../ScrollHeader";
import colors from "../../styles/colors";
import { OffertCard, UserCard } from "../BookOffert/General";
import ListMultiItem from "../ListItem/ListMultiItem";
import NativeGoBack from "../NativeGoBack";
import { Header1 } from "../Text";
import FullButton from "../FullButton";
import { pickOffert, getState } from "../../views/BookOffert";
import { OffertType } from "../../utils/constants";

export default class ChatHeader extends Component {
  getOffertButtonState = () => {
    const { type, title } = getState(
      this.props.chatData,
      pickOffert(this.props.chatData.offerts),
      this.props.userID,
      this.props.item
    );

    if (type == OffertType.INVALID || type == OffertType.BLOCKED) {
      return { disabled: true, title };
    } else {
      return { disabled: false, title };
    }
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
          <ListMultiItem
            data={item}
            isSingle={false}
            pk={item._id}
            native={true}
          />
          <ListMultiItem
            data={item}
            isSingle={false}
            pk={item._id}
            native={true}
          />
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
    const offertButtonState = this.getOffertButtonState();

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
        <NativeGoBack goBack={this.props.goBack} />
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Header1 color={"primary"} style={{ flex: 1 }} numberOfLines={1}>
            {chatData.UserTO.user.username}
          </Header1>
          <FullButton
            value={offertButtonState.title}
            style={{ marginHorizontal: 10 }}
            contentStyle={{ minWidth: 140, textAlign: "center" }}
            disabled={offertButtonState.disabled}
            onPress={this.props.goBookOffert}
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <ScrollHeader
        minHeight={60}
        renderContent={this.renderHeaderContent}
        renderHeader={this.renderHeader}
      />
    );
  }
}
