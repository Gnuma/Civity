import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import colors from "../styles/colors";
export default ({ children, style, ...rest }) => {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    elevation: 3
  }
});
