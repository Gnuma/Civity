import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ChatType } from "../../store/chat/types";
import Image from "react-native-fast-image";
import { Header4, Header3 } from "../Text";
import { printBookTitles, dateDisplay } from "../../utils/helper";
import Divider from "../Divider";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import { NavigationContext } from "react-navigation";

interface ChatLinkProps {
  chat: ChatType;
}

const ChatLink = ({ chat }: ChatLinkProps) => {
  const navigation = useContext(NavigationContext);

  let image;
  try {
    image = chat.items[0].image_ad[0];
  } catch (error) {}
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("ChatDetail", {
          chatID: chat.id
        })
      }
    >
      <Image style={styles.img} source={{ uri: image }} />
      <View style={styles.contentContainer}>
        <View style={styles.marginContent}>
          <Header4 color="primary" style={styles.flex1} numberOfLines={1}>
            {printBookTitles(chat.items.map(item => item.book))}
          </Header4>
          <View style={styles.notificationCircle} />
        </View>
        <View style={styles.middleContent}>
          <Header3 numberOfLines={1}>{chat.receiver.user.username}</Header3>
        </View>
        <View style={styles.marginContent}>
          <Header4 color="black" style={styles.flex1} numberOfLines={1}>
            {chat.messages[0] && chat.messages[0].text}
          </Header4>
          <Header4>{dateDisplay(chat.messages[0].createdAt)}</Header4>
        </View>
        <Divider />
      </View>
    </TouchableOpacity>
  );
};

export default ChatLink;

const LINK_HEIGHT = 75;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingTop: 15
  },
  img: {
    height: LINK_HEIGHT,
    width: LINK_HEIGHT,
    borderRadius: 4
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 5
  },
  marginContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  flex1: {
    flex: 1
  },
  middleContent: {
    flex: 1
  },
  notificationCircle: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: colors.black
  }
});
