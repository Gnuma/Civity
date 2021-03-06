import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import Button from "../Button";
import colors from "../../styles/colors";
import Shadows from "../Shadows";

export default class CheckBox extends Component {
  render() {
    const { onPress, active, style } = this.props;
    return (
      <Button
        style={[styles.button, active && styles.active, style]}
        onPress={onPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 35,
    height: 35,
    borderRadius: 4,
    backgroundColor: colors.white,
    ...Shadows[3]
  },
  active: {
    backgroundColor: colors.secondary,
    ...Shadows[1]
  }
});
