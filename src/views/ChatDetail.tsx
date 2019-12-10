import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import PropTypes from "prop-types";
import { connect, MapStateToPropsParam } from "react-redux";
import { StoreType } from "../store/root";
import { ChatType } from "../store/chat/types";
import { NavigationStackProp } from "react-navigation-stack";
import RNChat from "../components/RNChat/RNChat";

interface ChatDetailProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

export class ChatDetail extends Component<ChatDetailProps> {
  render() {
    const { messages } = this.props.chat;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <RNChat
            messages={messages}
            user={{ user: { id: 0, username: "AASA" }, news: 0 }}
          />
        </View>
      </SafeAreaView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
