import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";
import Image from "react-native-fast-image";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import Button from "../Button";
import Divider from "../Divider";
import { Header3, Header2, Header4, Header5 } from "../Text";
import helper from "../../utils/helper";
import BlockedBadge from "../Item/BlockedBadge";

export default class ShoppingChatsList extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    focus: PropTypes.number,
    data: PropTypes.object,
    orderedData: PropTypes.array,
    onGoChat: PropTypes.func
  };

  render() {
    const { data, focus, orderedData } = this.props;

    return (
      <FlatList
        data={orderedData[focus].chats}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        extraData={data}
      />
    );
  }

  _renderItem = ({ item, index }) => {
    const { data, orderedData, focus } = this.props;
    return (
      <View>
        <ChatLink
          data={data[orderedData[focus].subjectID].chats[item]}
          onGoChat={this.props.onGoChat}
          subjectID={orderedData[focus].subjectID}
        />
        {index !== orderedData[focus].chats.length - 1 ? (
          <Divider style={{ marginHorizontal: 20, borderBottomWidth: 0.8 }} />
        ) : null}
      </View>
    );
  };

  _keyExtractor = (item, index) => {
    return item.toString();
  };
}

export class ChatLink extends Component {
  render() {
    const { data, subjectID } = this.props;
    console.log(data);
    return (
      <Button
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center"
        }}
        onPress={() => this.props.onGoChat(subjectID, data._id)}
      >
        <View style={{ flex: 1 / 4 }}>
          <Image
            style={{ flex: 1, borderRadius: 6 }}
            source={{ uri: data.item.image_ad[0] }}
            resizeMode={"cover"}
          />
        </View>
        <View style={{ flex: 3 / 4, paddingLeft: 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Header2 color={"black"}>{data.UserTO.user.username}</Header2>
            </View>
            <Icon
              name={"chevron-circle-right"}
              size={22}
              style={{ color: data.hasNews ? colors.darkRed : colors.black }}
            />
          </View>
          {this.renderFooter()}
        </View>
      </Button>
    );
  }

  renderFooter = () => {
    const { data } = this.props;
    return (
      <View>
        <Header3 numberOfLines={1} color="black">
          {data.item.book.title}
        </Header3>
        <Header3 numberOfLines={1} color="black">
          EUR {data.item.price}
        </Header3>
        {data.messages.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Header4
              color={data.hasNews ? "darkRed" : "black"}
              style={{ flex: 1, marginRight: 10 }}
              numberOfLines={1}
            >
              {data.messages[0].text}
            </Header4>
            <Header5 color={data.hasNews ? "darkRed" : "grey"}>
              {helper.dateDisplay(data.messages[0].createdAt)}
            </Header5>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Header4 color={"white"}>AAA</Header4>
          </View>
        )}
      </View>
    );
  };
}
