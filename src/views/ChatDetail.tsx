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

interface ChatDetailProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

interface ChatDetailState {
  composer: string;
}

export class ChatDetail extends Component<ChatDetailProps, ChatDetailState> {
  navigationListeners: NavigationEventSubscription[] = [];

  state = {
    composer: ""
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
    this.setState({ composer: "" });
  };

  onComposerChange = (text: string) => this.setState({ composer: text });

  render() {
    const { messages, items } = this.props.chat;
    const { composer } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
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
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): ReduxDispatchProps => ({
  saveComposer: (composer, id) =>
    dispatch(chatActions.chatSaveComposer(composer, id)),
  setFocus: id => dispatch(chatActions.chatSetChatFocus(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
