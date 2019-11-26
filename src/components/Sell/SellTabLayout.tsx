import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ListRenderItem,
  ScrollView,
  SafeAreaView
} from "react-native";
import Selectable from "../Touchables/Selectable";
import { GeneralBook } from "../../types/ItemTypes";
import colors from "../../styles/colors";
import Shadows from "../Shadows";
import { Header2, Header4, Header1, Text } from "../Text";
import Button from "../Touchables/Button";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface SellBookBadge extends GeneralBook {
  completed?: boolean;
}

interface SellTabLayoutProps {
  data: SellBookBadge[];
  state: number;
  onGoBack: () => void;
  onContinue: () => void;
  onSwitchTab: (item: SellBookBadge, index: number) => void;
  onNavigationGoBack: () => void;
  children?: React.ReactNode;
  disableConfirm?: boolean;
}

const SellTabLayout = ({
  state,
  data,
  onGoBack,
  onContinue,
  onSwitchTab,
  onNavigationGoBack,
  children,
  disableConfirm
}: SellTabLayoutProps) => {
  const renderTab: ListRenderItem<SellBookBadge> = ({ item, index }) => {
    return (
      <Selectable
        onPress={() => onSwitchTab(item, index)}
        classType={item.completed ? "greenOpacity" : "green"}
        value={item.title}
        style={{ maxWidth: 140 }}
        selected={index === state}
        textProps={{ numberOfLines: 1 }}
      />
    );
  };

  if (data.length == 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerContainer, { height: 80 }]}></View>
      </View>
    );
  }

  let itemsToComplete = 0;
  let indexOfToComplete = state;
  data.forEach((item, index) => {
    if (!item.completed) {
      itemsToComplete++;
    } else if (indexOfToComplete >= index) indexOfToComplete--;
  });
  const focusedItem = data[state];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.scroller}>
          <View style={styles.backIconContainer}>
            <BackIconBackground />
            <TouchableOpacity onPress={onNavigationGoBack}>
              <MaterialIcon name="chevron-left" size={40} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={item => item.isbn}
            renderItem={renderTab}
            horizontal={true}
            contentContainerStyle={styles.badgeListContainer}
            ItemSeparatorComponent={() => <View style={styles.w10} />}
          />
        </View>
        <View style={styles.bookInfo}>
          <Header1 style={styles.bookTitle} color="primary" numberOfLines={1}>
            {data[state].title}
          </Header1>
          <Header4 style={styles.bookAuthor} numberOfLines={1}>
            Di {data[state].author}
          </Header4>
        </View>
      </View>
      <View style={styles.viewContainer}>
        <ScrollView>{children}</ScrollView>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.button}>
          <Button type="secondary" value="Indietro" onPress={onGoBack} />
        </View>
        <View style={styles.button}>
          <Button
            type="primary"
            value={focusedItem.completed ? "Continua" : "Salva "}
            disabled={disableConfirm}
            onPress={onContinue}
          >
            {!focusedItem.completed && (
              <Text style={styles.buttonCounter}>
                ({indexOfToComplete + 1}/{itemsToComplete})
              </Text>
            )}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SellTabLayout;

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewContainer: {
    flex: 1
  },
  headerContainer: {
    backgroundColor: colors.white,
    ...Shadows[3]
  },
  scroller: {
    flexDirection: "row",
    position: "relative",
    height: 80
  },
  badgeListContainer: {
    paddingRight: 10,
    paddingLeft: 10 + 50,
    alignSelf: "center"
  },
  backIconContainer: {
    position: "absolute",
    left: 0,
    width: 60,
    height: 70,
    marginVertical: 5,
    paddingLeft: 5,
    justifyContent: "center",
    zIndex: 2
  },
  w10: {
    width: 10
  },
  bookInfo: {
    marginHorizontal: 10,
    marginBottom: 10
  },
  bookTitle: {
    fontSize: 28
  },
  bookAuthor: {
    color: colors.darkGrey,
    fontSize: 16,
    lineHeight: 16
  },
  actionContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  button: {
    flex: 1,
    marginHorizontal: 5
  },
  buttonCounter: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white
  }
});

const BackIconBackground = () => (
  <Svg style={StyleSheet.absoluteFill}>
    <Defs>
      <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="80%" stopColor={colors.white} stopOpacity="1" />
        <Stop offset="100%" stopColor={colors.white} stopOpacity="0" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
  </Svg>
);
