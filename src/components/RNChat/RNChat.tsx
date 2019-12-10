import React, { Component } from "react";
import { Text, StyleSheet, View, FlatList, ListRenderItem } from "react-native";
import { getFullDate, toDate, BubbleDate } from "./Time";
import SystemMessage from "./SystemMessage";
import Bubble from "./Bubble";
import uuid from "uuid";
import { GeneralMessage, ChatUser, UserMessage } from "../../store/chat/types";

export interface RNChatProps {
  messages: GeneralMessage[];
  user: ChatUser;
}

export interface RNChatState {}

export default class RNChat extends Component<RNChatProps, RNChatState> {
  renderItem: ListRenderItem<GeneralMessage> = ({ item, index }) => {
    const { user: owner, messages } = this.props;

    const createdAt = toDate(item.createdAt);
    const nextMessage = messages[index + 1];

    let showDate = index == messages.length - 1;

    if (!showDate) {
      const nextTimestamp = toDate(nextMessage.createdAt);
      const currentDate = getFullDate(createdAt);
      const nextDate = getFullDate(nextTimestamp);
      showDate = currentDate !== nextDate;
    }

    if (item.system) {
      return (
        <View>
          {showDate && <BubbleDate date={createdAt} />}
          <SystemMessage text={item.text} />
        </View>
      );
    }

    const author = item.sender;
    const continuation =
      nextMessage &&
      author &&
      nextMessage.sender &&
      nextMessage.sender.user.id === author.user.id &&
      !showDate;

    if (item.system) {
      return (
        <View>
          {showDate && <BubbleDate date={createdAt} />}
          <SystemMessage text={item.text} />
        </View>
      );
    }

    const userMessage = getUserMessage(item, createdAt);

    return (
      <View>
        {showDate && <BubbleDate date={createdAt} />}
        {item.system ? (
          <SystemMessage text={item.text} />
        ) : (
          <Bubble
            item={userMessage}
            showDate={showDate}
            continuation={!!continuation}
            userMade={!!(author && owner.user.id === author.user.id)}
          />
        )}
      </View>
    );
  };

  //Render
  render() {
    const { messages } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          inverted
          removeClippedSubviews={true}
          windowSize={31}
          maxToRenderPerBatch={30}
        />
      </View>
    );
  }

  keyExtractor = (item: GeneralMessage) => item.id.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  audioPlayer: {
    height: 0
  }
});

const getUserMessage = (item: GeneralMessage, createdAt: Date): UserMessage => {
  if (item.sender)
    return {
      ...item,
      createdAt,
      sender: item.sender
    };
  else
    return {
      ...item,
      createdAt,
      sender: {
        user: {
          id: -1,
          username: "Error"
        },
        news: 0
      }
    };
};
