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
import ItemSmall from "../Item/ItemSmall";
import styles from "./styles";

interface BubbleProps {
  item: UserMessage;
  showDate: boolean;
  continuation: boolean;
  userMade: boolean;
}

const Bubble = ({ item, showDate, continuation, userMade }: BubbleProps) => {
  const sidedStyle = userMade ? rightStyle : leftStyle;
  return (
    <View
      style={[
        styles.container,
        sidedStyle.container,
        !continuation ? sidedStyle.continuation : null
      ]}
    >
      {item.attachment && renderAttachment(item.attachment)}
      <View style={styles.contentContainer}>
        {item.text !== null && item.text !== undefined && (
          <MessageText style={[styles.content, sidedStyle.text]}>
            {item.text}
          </MessageText>
        )}
        <TimeSpan createdAt={item.createdAt} style={sidedStyle.text} />
      </View>
    </View>
  );
};

export default Bubble;

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
