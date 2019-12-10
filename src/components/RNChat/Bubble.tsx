import React, { Fragment } from "react";
import { View, StyleSheet, Alert, StyleProp, TextStyle } from "react-native";
import ParsedText from "react-native-parsed-text";
import { TimeSpan } from "./Time";
import Image from "react-native-fast-image";
import {
  GenericAttachment,
  AttachmentType,
  UserMessage
} from "../../store/chat/types";
import Shadows from "../Shadows";
import colors from "../../styles/colors";

interface BubbleProps {
  item: UserMessage;
  showDate: boolean;
  continuation: boolean;
  userMade: boolean;
}

const Bubble = ({ item, showDate, continuation, userMade }: BubbleProps) => {
  const renderAttachment = (attachment: GenericAttachment) => {
    switch (attachment.type) {
      case AttachmentType.IMAGE:
        return (
          <Image
            style={styles.image}
            source={{
              uri: attachment.url
            }}
            resizeMode={Image.resizeMode.cover}
          />
        );
      default:
        break;
    }
  };
  const sidedStyle = userMade ? rightStyle : leftStyle;
  return (
    <View
      style={[
        styles.container,
        sidedStyle.container,
        !continuation ? sidedStyle.continuation : null
      ]}
    >
      <Fragment>
        {item.attachment && renderAttachment(item.attachment)}
        {item.text !== null && item.text !== undefined && (
          <MessageText style={[styles.content, sidedStyle.text]}>
            {item.text}
          </MessageText>
        )}
        <TimeSpan item={item} style={sidedStyle.text} />
      </Fragment>
    </View>
  );
};

export default Bubble;

interface MessageTextProps {
  children: React.ReactNode;
  style: StyleProp<TextStyle>;
}
export const MessageText = ({ children, ...rest }: MessageTextProps) => {
  return (
    <ParsedText {...rest} parse={MESSAGE_PARSER}>
      {children}
    </ParsedText>
  );
};

const OTHER_BACKGROUND_COLOR = colors.white;
const USER_BACKGROUND_COLOR = colors.primary;

const styles = StyleSheet.create({
  fullScreen: {
    width: 100,
    height: 100,
    backgroundColor: "red"
  },
  container: {
    minWidth: 100,
    maxWidth: 300,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 5,
    borderRadius: 10,
    ...Shadows[1]
  },
  left: {
    alignSelf: "flex-start",
    backgroundColor: OTHER_BACKGROUND_COLOR
  },
  right: {
    alignSelf: "flex-end",
    backgroundColor: USER_BACKGROUND_COLOR
  },
  pressed: {
    backgroundColor: "#D1FCFF"
  },
  content: {
    fontSize: 15,
    paddingBottom: 4
  },
  newMessageLeft: {
    marginTop: 15,
    borderTopLeftRadius: 0
  },
  newMessageRight: {
    marginTop: 15,
    borderTopRightRadius: 0
  },
  link: {
    color: "#0645AD",
    textDecorationLine: "underline"
  },
  image: {
    width: 300 - 8 * 2,
    height: 300 - 8 * 2,
    borderRadius: 4
  },
  textRight: {
    color: colors.white
  },
  textLeft: {
    color: colors.black
  }
});

const leftStyle = {
  container: styles.left,
  text: styles.textLeft,
  continuation: styles.newMessageLeft
};
const rightStyle = {
  container: styles.right,
  text: styles.textRight,
  continuation: styles.newMessageRight
};

const handleLinkPress = (link: string) => Alert.alert(`${link} pressed!`);

const MESSAGE_PARSER = [
  { type: "url", style: styles.link, onPress: handleLinkPress },
  { type: "phone", style: styles.link, onPress: handleLinkPress },
  { type: "email", style: styles.link, onPress: handleLinkPress },
  { pattern: /#(\w+)/, style: styles.link, onPress: handleLinkPress }
];
