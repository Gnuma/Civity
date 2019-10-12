import React, { Component } from "react";
import { Text, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Button, { ButtonProps } from "./Button";
import Icon from "react-native-vector-icons/FontAwesome";
import Shadows from "./Shadows";

export interface SolidButtonProps extends ButtonProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  icon?: string;
  iconSize?: number;
  center?: boolean;
  iconStyle?: StyleProp<ViewStyle>;
}

export default ({
  children,
  style,
  icon,
  iconSize,
  iconStyle,
  center,
  ...rest
}: SolidButtonProps) => {
  return (
    <Button style={[styles.container, style]} {...rest}>
      {children}
      {icon ? (
        <Icon name={icon} size={iconSize} style={[styles.icon, iconStyle]} />
      ) : null}
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    ...Shadows[2],
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4
  },
  icon: {
    position: "absolute",
    alignSelf: "center",
    right: 10
  },
  children: {
    flex: 1
  }
});
