import React, { Component } from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native-gesture-handler";

const isiOS = Platform.OS === "ios";

export class Button extends Component {
  render() {
    const { disabled, children, style, onPress, ...rest } = this.props;

    if (disabled) {
      return (
        <View pointerEvents="box-only" style={[styles.button, style]}>
          {children}
        </View>
      );
    } else {
      return (
        <View style={[styles.button, style]}>
          {isiOS ? (
            <TouchableOpacity
              style={[styles.innerButton, style]}
              onPress={onPress}
              {...rest}
            >
              {children}
            </TouchableOpacity>
          ) : (
            <TouchableNativeFeedback
              style={[styles.innerButton, style]}
              onPress={onPress}
              {...rest}
            >
              {children}
            </TouchableNativeFeedback>
          )}
        </View>
      );
    }
  }
}

Button.defaultProps = { disabled: false };

export default Button;

const styles = StyleSheet.create({
  button: {
    overflow: "hidden"
  },
  innerButton: {
    flex: 1
  }
});
