import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect, MapStateToPropsParam } from "react-redux";
import { StoreType } from "../store/root";
import { ChatType } from "../store/chat/types";
import { NavigationStackProp } from "react-navigation-stack";

interface ChatDetailProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

export class ChatDetail extends Component<ChatDetailProps> {
  render() {
    return (
      <View>
          
        <Text>{this.props.chat.id}</Text>
      </View>
    );
  }
}

interface ReduxStoreProps {
  chat: ChatType;
}

const mapStateToProps = (
  state: StoreType,
  props: { navigation: NavigationStackProp }
) => ({
  chat: state.chat.data[props.navigation.getParam("chatID", -1)]
});

interface ReduxDispatchProps {}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatDetail);
