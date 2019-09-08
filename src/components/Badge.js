import React, { Fragment } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Header4 } from "./Text";
import colors from "../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";

export const ProBadge = ({ style, size = 10 }) => {
  return (
    <Header4 style={[styles.proBadge, { fontSize: size }, style]}>
      <Icon style={styles.proIcon} name="arrow-up" size={size} /> PRO
    </Header4>
  );
};

const styles = StyleSheet.create({
  proBadge: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingLeft: 6,
    paddingRight: 10,
    backgroundColor: colors.darkRed,
    color: colors.white,
    alignItems: "center"
  },
  proIcon: {
    color: colors.white
  }
});
