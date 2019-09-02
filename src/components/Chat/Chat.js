import React, { Component } from "react";
import {
  View,
  TextInput,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import PropTypes from "prop-types";
import { Header5, Header3 } from "../Text";
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
import { OffertStatus, ChatStatus, IT_MONTHS } from "../../utils/constants";
import LoadingOverlay from "../LoadingOverlay";
import Shadows from "../Shadows";
import NativeButton from "../NativeButton";
import RNChat from "../RNChat";
import { dispalyTime } from "../RNChat/Timestamp";

export default class Chat extends Component {
  onSend = () => {
    const content = String(this.props.data.composer).trim();
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
    const { item, userMade } = props;
    let style = userMade
      ? { ...styles.time, ...styles.timeRight }
      : { ...styles.time, ...styles.timeLeft };

    if (item.isSending) return <Header5 style={style}>Inviando...</Header5>;
    else if (item.error)
      return <Header5 style={[style, styles.timeError]}>Non inviato</Header5>;
    return <Header5 style={style}>{dispalyTime(item.timestamp)}</Header5>;
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

  renderInput = () => {
    const { data, type, globalLoading, userID } = this.props;

    const canSend = !!data.composer;
    if (this.isBlocked()) return this.renderBlockedComposer();
    else
      return (
        <View style={styles.inputToolbarContainer} behavior="padding">
          <ScrollView style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              multiline
              placeholder={"Invia un messaggio"}
              value={data.composer}
              onChangeText={this.onComposerTextChanged}
            />
          </ScrollView>
          <TouchableOpacity
            style={styles.btn}
            onPress={this.onSend}
            disabled={!canSend}
          >
            <Icon
              name={"paper-plane"}
              size={26}
              style={{ color: canSend ? colors.secondary : colors.black }}
            />
          </TouchableOpacity>
        </View>
      );
  };

  render() {
    const { data, type, globalLoading, userID } = this.props;

    return (
      <View style={{ flex: 1 }} behavior="padding">
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
            },
            months: IT_MONTHS
          }}
          renderInput={this.renderInput}
          styleBubble={styleBubble}
          renderTime={this.renderTime}
        />
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

const styles = StyleSheet.create({
  inputToolbarContainer: {
    borderRadius: 10,
    backgroundColor: colors.white,
    marginHorizontal: 10,
    marginVertical: 10,
    ...Shadows[2],
    alignItems: "center",
    flexDirection: "row"
  },
  inputContainer: {
    maxHeight: 200,
    padding: 10
  },
  btn: {
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 4,
    paddingHorizontal: 12
  },
  input: {
    flex: 1,
    fontSize: 17,
    padding: 0
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
  },

  bubbleContainerLeft: {
    backgroundColor: colors.white,
    ...Shadows[1]
  },
  bubbleContainerRight: {
    backgroundColor: colors.primary,
    ...Shadows[1]
  },
  bubbleTextLeft: {
    color: colors.black
  },
  bubbleTextRight: {
    color: colors.white
  },
  time: {
    alignSelf: "flex-end",
    fontSize: 12
  },
  timeRight: {
    color: colors.white
  },
  timeLeft: {
    color: colors.black
  },
  timeError: {
    color: colors.darkRed
  }
});

const styleBubble = {
  left: {
    container: styles.bubbleContainerLeft,
    text: styles.bubbleTextLeft
  },
  right: {
    container: styles.bubbleContainerRight,
    text: styles.bubbleTextRight
  }
};

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
