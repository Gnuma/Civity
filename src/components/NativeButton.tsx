import React, { Component } from "react";
import { StyleSheet, View, Platform, StyleProp, ViewStyle } from "react-native";
import {
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native-gesture-handler";
import { TouchableProps } from "react-native-svg";

const isiOS = Platform.OS === "ios";

interface NativeButtonProps extends TouchableProps {
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export class Button extends Component<NativeButtonProps> {
  static defaultProps = { disabled: false };

  render() {
    const { disabled, children, style, ...rest } = this.props;

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
            <TouchableOpacity style={[styles.innerButton, style]} {...rest}>
              {children}
            </TouchableOpacity>
          ) : (
            <TouchableNativeFeedback
              style={[styles.innerButton, style]}
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

export default Button;

const styles = StyleSheet.create({
  button: {
    overflow: "hidden"
  },
  innerButton: {
    flex: 1
  }
});
