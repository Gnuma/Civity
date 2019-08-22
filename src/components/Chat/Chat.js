import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import { Header2, Header4, Header5, Header3 } from "../Text";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  GiftedChat,
  Bubble,
  Time,
  InputToolbar,
  Composer,
  Send
} from "react-native-gifted-chat";
import colors from "../../styles/colors";
import Button from "../Button";
import Offert from "./Offert";
import _ from "lodash";
import { OffertStatus, ChatStatus } from "../../utils/constants";
import LoadingOverlay from "../LoadingOverlay";
import Shadows from "../Shadows";
import NativeButton from "../NativeButton";
import RNChat from "../RNChat";

export default class Chat extends Component {
  onSend = message => {
    const content = message.text;
    content &&
      this.props.salesSend(this.props.objectID, this.props.chatID, content);
  };

  onComposerTextChanged = text => {
    this.props.salesSetComposer(this.props.objectID, this.props.chatID, text);
  };

  loadEarlier = () => {
    !this.props.data.loading && this.props.loadEarlier();
  };

  renderInputToolbar = props => {
    if (this.isBlocked()) return null;
    return (
      <InputToolbar
        {...props}
        primaryStyle={styles.inputToolbarPrimary}
        containerStyle={styles.inputToolbarContainer}
      />
    );
  };

  renderComposer = props => {
    return (
      <Composer
        {...props}
        textInputStyle={{
          justifyContent: "center",
          lineHeight: 18,
          fontSize: 18
        }}
      />
    );
  };

  renderSend = props => {
    return (
      <Send
        {...props}
        alwaysShowSend={true}
        containerStyle={{
          alignSelf: "center",
          paddingHorizontal: 10,
          justifyContent: "center"
        }}
      >
        <Icon
          name={"paper-plane"}
          size={26}
          style={{ color: props.disabled ? colors.black : colors.secondary }}
        />
      </Send>
    );
  };

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.primary,
            ...Shadows[1]
          },
          left: {
            ...Shadows[1],
            backgroundColor: colors.white
          }
        }}
      />
    );
  };

  renderOffert = () => {
    const { data, item, goBookOffert } = this.props;
    console.log(data);
    if (
      _.isEmpty(data.offerts) ||
      data.offerts[0].status === OffertStatus.REJECTED
    )
      return null;
    else
      return (
        <Offert
          offert={data.offerts[0]}
          item={item}
          goBookOffert={goBookOffert}
        />
      );
  };

  renderTime = props => {
    const { currentMessage } = props;
    if (currentMessage.isSending)
      return (
        <Header5
          style={{
            color: props.position === "left" ? colors.grey : colors.white,
            justifyContent: "center",
            textAlign: "center",
            paddingHorizontal: 15,
            lineHeight: 11
          }}
        >
          Inviando...
        </Header5>
      );
    else if (currentMessage.error)
      return (
        <Header5
          style={{
            color: props.position === "left" ? colors.grey : colors.white,
            justifyContent: "center",
            textAlign: "center",
            paddingHorizontal: 15,
            lineHeight: 11,
            color: colors.red
          }}
        >
          Errore
        </Header5>
      );
    else return <Time {...props} />;
  };

  isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return (
      contentSize.height -
        layoutMeasurement.height -
        contentSize.height * 0.2 <=
      contentOffset.y
    );
  };

  isBlocked = () => {
    const { data } = this.props;
    return (
      data.status == ChatStatus.BLOCKED || data.status == ChatStatus.REJECTED
    );
  };

  render() {
    const { data, type, globalLoading, userID } = this.props;
    const isBlocked = this.isBlocked();

    return (
      <View style={{ flex: 1 }}>
        <RNChat
          text={data.composer}
          onChangeText={this.onComposerTextChanged}
          onSend={this.onSend}
          data={data.messages}
          user={{
            _id: userID
          }}
          loadEarlier={this.loadEarlier}
          loading={data.loading}
          renderFooter={this.renderOffert}
          syntax={{
            user: {
              id: "_id"
            },
            message: {
              id: "_id",
              timestamp: "createdAt"
            }
          }}
        />
        {isBlocked && this.renderBlockedComposer()}
        {globalLoading && <LoadingOverlay />}
      </View>
    );
  }
  renderNull = () => null;

  onScroll = ({ nativeEvent }) => {
    this.isCloseToTop(nativeEvent) &&
      !this.props.data.loading &&
      this.loadEarlier();
  };

  listViewProps = {
    onScroll: this.onScroll
  };

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    });
  }

  renderBlockedComposer = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View style={styles.blockedContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              margin: 6,
              alignItems: "center"
            }}
          >
            <Header3 color="black" style={{ flex: 1 }}>
              La chat non è più attiva. L'inserzione è stata eliminata o venduta
              ad un altro utente.
            </Header3>
            <Icon
              name={"ban"}
              size={40}
              style={{ color: colors.darkRed, marginHorizontal: 10 }}
            />
          </View>
        </View>
      </View>
    );
  };
}

/**
        <View style={{ zIndex: 0, ...Shadows[0] }}>
          <Composer
            onSend={this.onSend}
            onComposerTextChanged={this.onComposerTextChanged}
            text={data.composer}
            type={type}
            data={data}
          />
        </View>
 */

const styles = StyleSheet.create({
  inputToolbarPrimary: {
    borderRadius: 10,
    backgroundColor: colors.white,
    marginHorizontal: 20,
    ...Shadows[2],
    alignItems: "center"
  },
  inputToolbarContainer: {
    borderTopWidth: 0,
    paddingBottom: 5
  },
  blockedContainer: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: colors.white,
    marginBottom: 10,
    marginTop: 5,
    marginHorizontal: 20,
    minHeight: 50,
    ...Shadows[2]
  }
});

/**
 *         <GiftedChat
          text={data.composer}
          onInputTextChanged={this.onComposerTextChanged}
          onSend={this.onSend}
          messages={data.messages}
          renderAvatar={null}
          user={{
            _id: userID
          }}
          renderBubble={this.renderBubble}
          renderTime={this.renderTime}
          renderInputToolbar={this.renderInputToolbar}
          minComposerHeight={30}
          maxComposerHeight={130}
          minInputToolbarHeight={isBlocked ? 0 : 50}
          listViewProps={this.listViewProps}
          loadEarlier={data.loading}
          extraData={{ loading: data.loading }}
          renderSend={this.renderSend}
          renderFooter={this.renderOffert}
          renderComposer={this.renderComposer}
          renderLoadEarlier={() => {
            return (
              <ActivityIndicator
                style={{
                  alignSelf: "center"
                }}
                size="large"
              />
            );
          }}
        />
 */
