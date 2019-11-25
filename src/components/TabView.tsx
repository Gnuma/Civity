import React, { useState } from "react";
import { View, FlatList, StyleSheet, ListRenderItem } from "react-native";
import { Header3 } from "./Text";
import Button from "./Touchables/Button";
import Shadows from "./Shadows";
import colors from "../styles/colors";

interface TabViewProps<T> {
  state: number;
  data: T[];
  renderTab: ListRenderItem<T>;
  children?: React.ReactNode;
}

function TabView<T>({ data, state, children, renderTab }: TabViewProps<T>) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderTab}
      horizontal={true}
    />
  );
}

export default TabView;

const styles = StyleSheet.create({
  headerItem: {
    marginHorizontal: 10,
    marginVertical: 5
  }
});
