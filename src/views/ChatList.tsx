import React from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ListRenderItem
} from "react-native";
import { connect } from "react-redux";
import { StoreType } from "../store/root";
import { ChatDataType } from "../store/chat/types";
import { NavigationStackProp } from "react-navigation-stack";
import { ChatType } from "../store/chat/types";
import ChatLink from "../components/Chat/ChatLink";
import { Header1, Header3, Header2 } from "../components/Text";
import colors from "../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import ChatIcon from "../media/vectors/ChatIcon";

interface ChatListProps extends ReduxDispatchProps {
  navigation: NavigationStackProp;
}

const ChatList = ({ chats, chatOrder, navigation }: ChatListProps) => {
  const renderChatLink: ListRenderItem<string> = ({ item: chatID }) => {
    return <ChatLink chat={chats[chatID]} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatHeader}>
        <Header1 style={styles.headerText}>Chats</Header1>
        <TouchableOpacity style={styles.profileBtn}>
          <Icon name="user" size={20} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      {chatOrder.length > 0 ? (
        <FlatList
          data={chatOrder}
          renderItem={renderChatLink}
          keyExtractor={item => item}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Header2 style={[styles.textCenter, styles.bold]}>
            Nessuna conversazione
          </Header2>
          <ChatIcon
            color={colors.secondary}
            size={80}
            style={styles.chatIconCenter}
          />
          <Header3 style={styles.textCenter}>
            Da qui puoi gestire tutte le tue compravendite
          </Header3>
        </View>
      )}
    </SafeAreaView>
  );
};

interface ReduxDispatchProps {
  chats: ChatDataType;
  chatOrder: string[];
}

const mapStateToProps = (state: StoreType): ReduxDispatchProps => ({
  chats: state.chat.data,
  chatOrder: state.chat.chatOrder
});

export default connect(mapStateToProps, null)(ChatList);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chatHeader: {
    height: 60,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15
  },
  headerText: {
    color: colors.white,
    flex: 1
  },
  profileBtn: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.white
  },
  profileIcon: { color: colors.white },
  emptyContainer: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 250
  },
  textCenter: {
    textAlign: "center"
  },
  bold: {
    fontWeight: "700"
  },
  chatIconCenter: {
    marginVertical: 20
  }
});
