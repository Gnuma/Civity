import React, { Component } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import SortableTab from "../../components/SortableTab";
import Animated from "react-native-reanimated";

const { Value } = Animated;

export const TAB_COLUMNS = 2;
export const TAB_SIZE = Dimensions.get("window").width / TAB_COLUMNS;

const tabs: { id: number; color: string }[] = [
  { id: 1, color: "red" },
  { id: 2, color: "white" },
  { id: 3, color: "yellow" },
  { id: 4, color: "green" },
  { id: 5, color: "orange" }
];

export default class PhotosList extends Component {
  render() {
    const offsets = tabs.map((_, index) => ({
      x: new Value(index % TAB_COLUMNS === 0 ? 0 : TAB_SIZE),
      y: new Value(Math.floor(index / TAB_COLUMNS) * TAB_SIZE)
    }));
    return (
      <View style={styles.container}>
        {tabs.map((tab, index) => (
          <SortableTab key={tab.id} {...{ tab, index, offsets }}>
            <View style={styles.tabContainer}>
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  margin: 20,
                  backgroundColor: tab.color
                }}
              />
            </View>
          </SortableTab>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1d1e"
  },
  tabContainer: {
    width: TAB_SIZE,
    height: TAB_SIZE
  }
});
