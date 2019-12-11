import React, { Fragment } from "react";
import { View, StyleSheet } from "react-native";
import {
  SystemMessage as SystemMessageType,
  AttachmentType,
  ChatUser
} from "../../store/chat/types";
import { Text } from "../Text";
import styles, {
  CHAT_SMALL_ITEM_HEIGHT,
  CHAT_SMALL_ITEM_WIDTH
} from "./styles";
import { TimeSpan } from "./Time";
import { MessageText } from "./Bubble";
import ItemSmall from "../Item/ItemSmall";
import { GeneralItem } from "../../types/ItemTypes";

interface SystemMessageProps {
  userID: number;
  item: SystemMessageType;
}

const SystemMessage = ({ item, userID }: SystemMessageProps) => {
  if (!item.attachment)
    return <Text style={[styles.systemMessage]}>{item.text}</Text>;
  switch (item.attachment.type) {
    case AttachmentType.ITEM:
      return renderItemsModificationMessage({
        message: item,
        item: item.attachment.item,
        userID: userID,
        buyer: item.attachment.buyer
      });

    default:
      return null;
  }
};

export default SystemMessage;

const rightStyle = {
  container: styles.itemRightContainer,
  text: styles.textRight
};

const leftStyle = {
  container: styles.itemLeftContainer,
  text: styles.textLeft
};

interface ItemsModificationMessageProps {
  message: SystemMessageType;
  userID: number;
  item: GeneralItem;
  buyer: ChatUser;
}
const renderItemsModificationMessage = ({
  message,
  item,
  userID,
  buyer
}: ItemsModificationMessageProps) => {
  const userMade = userID == buyer.user.id;
  const sidedStyle = userMade ? rightStyle : leftStyle;

  const connection = (
    <Fragment>
      <View style={styles.itemSideGreenConnector} />
      <View style={styles.itemSideCircleContainer}>
        <View style={styles.itemSideAdd} />
      </View>
    </Fragment>
  );

  return (
    <View style={styles.itemModificationContainer}>
      <View style={styles.itemSideContainer}>{!userMade && connection}</View>
      <View
        style={[
          styles.container,
          styles.itemModificationBubbleContainer,
          sidedStyle.container
          //!continuation ? sidedStyle.continuation : null
        ]}
      >
        <ItemSmall
          width={CHAT_SMALL_ITEM_WIDTH}
          height={CHAT_SMALL_ITEM_HEIGHT}
          item={item}
        />
        <View style={styles.contentContainer}>
          {message.text !== null && message.text !== undefined && (
            <MessageText style={[styles.content, sidedStyle.text]}>
              {message.text}
            </MessageText>
          )}
          <TimeSpan createdAt={message.createdAt} style={sidedStyle.text} />
        </View>
      </View>
      <View style={styles.itemSideContainer}>{userMade && connection}</View>
    </View>
  );
};
