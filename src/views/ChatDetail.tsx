import React, { Component } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";
import { connect, MapStateToPropsParam } from "react-redux";
import { StoreType } from "../store/root";
import { ChatType } from "../store/chat/types";
import { NavigationStackProp } from "react-navigation-stack";
import RNChat from "../components/RNChat/RNChat";
import ItemSmall from "../components/Item/ItemSmall";
import Composer from "../components/RNChat/Composer";
import * as chatActions from "../store/chat";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { NavigationEventSubscription } from "react-navigation";
import { IS_ANDROID } from "../utils/constants";
import ChatHeader from "../components/Chat/ChatHeader";

interface ChatDetailProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

interface ChatDetailState {
  composer: string;
  showHeader: boolean;
}

export class ChatDetail extends Component<ChatDetailProps, ChatDetailState> {
  navigationListeners: NavigationEventSubscription[] = [];

  state = {
    composer: "",
    showHeader: false
  };

  componentDidMount = () => {
    const id = this.props.chat.id;
    const { navigation } = this.props;
    this.props.setFocus(id);
    this.navigationListeners = [
      navigation.addListener("didBlur", () => {
        this.props.setFocus(null);
        this.props.saveComposer(this.state.composer, id);
      })
    ];
  };
  componentWillUnmount = () =>
    this.navigationListeners.forEach(l => l.remove());

  onSend = () => {
    const composer = this.state.composer;
    const chatID = this.props.chat.id;
    this.props.sendMessage(chatID, composer);
    this.setState({ composer: "" });
  };

  onComposerChange = (text: string) => this.setState({ composer: text });

  render() {
    const { messages, items } = this.props.chat;
    const { composer, showHeader } = this.state;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        enabled={!IS_ANDROID}
      >
        <ChatHeader
          show={showHeader}
          chat={this.props.chat}
          goBack={this.goBack}
          setHeaderOpen={this.setHeaderOpen}
        />
        <RNChat
          messages={messages}
          user={{ user: { id: 0, username: "AASA" }, news: 0 }}
        />
        <SafeAreaView>
          <Composer
            value={composer}
            onChangeText={this.onComposerChange}
            onSend={this.onSend}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  goBack = () => this.props.navigation.goBack(null);
  setHeaderOpen = (showHeader: boolean) => this.setState({ showHeader });
}

//<ItemSmall width={280} height={100} item={items[0]} />;

interface ReduxStoreProps {
  chat: ChatType;
}

const mapStateToProps = (
  state: StoreType,
  props: { navigation: NavigationStackProp }
) => ({
  chat: state.chat.data[props.navigation.getParam("chatID", -1)]
});

interface ReduxDispatchProps {
  saveComposer: typeof chatActions.chatSaveComposer;
  setFocus: typeof chatActions.chatSetChatFocus;
  sendMessage: typeof chatActions.chatCreateMessage;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): ReduxDispatchProps => ({
  saveComposer: (composer, id) =>
    dispatch(chatActions.chatSaveComposer(composer, id)),
  setFocus: id => dispatch(chatActions.chatSetChatFocus(id)),
  sendMessage: (chatID, composer) =>
    dispatch(chatActions.chatCreateMessage(chatID, composer))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
