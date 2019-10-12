import React, { Component } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ViewProps
} from "react-native";
import colors from "../styles/colors";
import Shadows from "./Shadows";

interface Props {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  rest?: ViewProps;
}

export default ({ children, style, ...rest }: Props) => {
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
    ...Shadows[3]
  }
});
