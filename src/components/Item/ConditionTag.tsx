import React from "react";
import { View, StyleSheet } from "react-native";
import {
  ItemConditionType,
  ItemCondition,
  ItemConditionToText
} from "../../types/ItemTypes";
import colors from "../../styles/colors";
import { Text } from "../Text";

interface ConditionTagProps {
  type?: ItemCondition;
}

const ConditionTag = ({ type = ItemCondition.Good }: ConditionTagProps) => {
  return (
    <View
      style={[styles.container, { backgroundColor: getBackgroundColor(type) }]}
    >
      <View style={[styles.tagHole]}></View>
      <Text style={[styles.condition]}>{ItemConditionToText[type]}</Text>
    </View>
  );
};

export default ConditionTag;

const getBackgroundColor = (type: ItemCondition) => {
  switch (type) {
    case ItemCondition.Good:
      return colors.secondary;
    case ItemCondition.Medium:
      return colors.lightYellow;
    case ItemCondition.Bad:
      return colors.darkGreen;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  tagHole: {
    backgroundColor: colors.white,
    borderRadius: 999,
    width: 10,
    height: 10,
    marginHorizontal: 7
  },
  condition: {
    color: colors.white,
    fontSize: 16
  }
});
