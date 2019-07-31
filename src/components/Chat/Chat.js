import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import { Header2, Header4, Header5 } from "../Text";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  GiftedChat,
  Bubble,
  Time,
  InputToolbar
} from "react-native-gifted-chat";
import colors from "../../styles/colors";
import Button from "../Button";
import Composer from "./Composer";
import Offert from "./Offert";
import _ from "lodash";
import { OffertStatus } from "../../utils/constants";
import LoadingOverlay from "../LoadingOverlay";

export default class Chat extends Component {
  onSend = () => {
    this.props.salesSend(this.props.objectID, this.props.chatID);
  };

  onComposerTextChanged = text => {
    this.props.salesSetComposer(this.props.objectID, this.props.chatID, text);
  };

  loadEarlier = () => {
    !this.props.data.loading && this.props.loadEarlier();
  };

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.primary,
            elevation: 1
          },
          left: {
            elevation: 1,
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

  render() {
    const { data, type, globalLoading, userID } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={data.messages}
          renderAvatar={null}
          user={{
            _id: userID
          }}
          renderBubble={this.renderBubble}
          renderTime={this.renderTime}
          renderInputToolbar={this.renderNull}
          renderComposer={this.renderNull}
          minInputToolbarHeight={0}
          maxComposerHeight={0}
          listViewProps={this.listViewProps}
          loadEarlier={data.loading}
          extraData={{ loading: data.loading }}
          renderFooter={this.renderOffert}
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
        <View style={{ zIndex: 0, elevation: 0 }}>
          <Composer
            onSend={this.onSend}
            onComposerTextChanged={this.onComposerTextChanged}
            text={data.composer}
            type={type}
            data={data}
          />
        </View>
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
}
