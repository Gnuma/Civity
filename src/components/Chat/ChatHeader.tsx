import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ChatType } from "../../store/chat/types";
import Shadows from "../Shadows";
import colors from "../../styles/colors";
import LabeledField from "../Inputs/LabeledField";
import GoBackButton from "../Touchables/GoBackButton";
import { Header3, Header4 } from "../Text";
import { printBookTitles } from "../../utils/helper";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
import Animated from "react-native-reanimated";
import ItemCarousel from "../Item/ItemCarousel";
import _ from "lodash";
import UserLink from "../UserSettings/UserLink";

interface ChatHeaderProps {
  show?: boolean;
  chat: ChatType;
  goBack: () => void;
  setHeaderOpen: (showHeader: boolean) => void;
}

const ChatHeader = ({ show, chat, goBack, setHeaderOpen }: ChatHeaderProps) => {
  const { height: vh, width: vw } = Dimensions.get("window");
  const books = chat.items.map(item => item.book);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: -(show ? CHAT_HEADER_HEIGHT : vh) }],
          minHeight: vh + CHAT_HEADER_HEIGHT,
          width: vw
        }
      ]}
    >
      <View style={styles.headerContainer}>
        <GoBackButton goBack={goBack} />
        <View style={styles.headerContent}>
          <Header3 style={styles.username}>
            {chat.receiver.user.username}
          </Header3>
          <Header4 style={styles.books} numberOfLines={1}>
            {books.length > 0
              ? printBookTitles(books)
              : "Nessun libro nel carrello"}
          </Header4>
        </View>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setHeaderOpen(!show)}
        >
          <Icon name="ellipsis-v" size={20} style={styles.menuIcon}></Icon>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <UserLink
          user={chat.receiver}
          containerStyle={styles.userLinkContainer}
        ></UserLink>
        <LabeledField
          label={`ALTRI DA ${_.toUpper(chat.receiver.user.username)}`}
          style={styles.carouselLabel}
        >
          <ItemCarousel items={chat.items} style={styles.itemsCarousel} />
        </LabeledField>
        <LabeledField label="CARRELLO" style={styles.carouselLabel}>
          <ItemCarousel items={chat.items} style={styles.itemsCarousel} />
        </LabeledField>
      </View>
    </Animated.View>
  );
};

export default ChatHeader;

export const CHAT_HEADER_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "column-reverse",
    backgroundColor: colors.white,
    zIndex: 10
  },
  headerContainer: {
    height: CHAT_HEADER_HEIGHT,
    backgroundColor: colors.white,
    ...Shadows[3],

    flexDirection: "row",
    alignItems: "center"
  },
  username: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "bold"
  },
  books: {
    lineHeight: 20,
    color: colors.primary
  },
  headerContent: {
    flex: 1
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    marginRight: 10
  },
  menuIcon: {
    color: colors.black
  },

  content: {
    flex: 1,
    backgroundColor: colors.lighLighGrey,
    justifyContent: "flex-end"
  },
  itemsCarousel: {
    paddingHorizontal: 15,
    marginBottom: 20
  },
  carouselLabel: {
    marginLeft: 25
  },
  userLinkContainer: {
    marginHorizontal: 15,
    marginBottom: 20
  }
});
