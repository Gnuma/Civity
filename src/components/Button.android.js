import React, { Component } from "react";
import { StyleSheet, View, TouchableNativeFeedback } from "react-native";

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
        <TouchableNativeFeedback
          onPress={onPress}
          //background={TouchableNativeFeedback.Ripple()}
          useForeground={true}
          {...rest}
        >
          <View pointerEvents="box-only" style={[styles.button, style]}>
            {children}
          </View>
        </TouchableNativeFeedback>
      );
    }
  }
}

Button.defaultProps = { disabled: false };

export default Button;

const styles = StyleSheet.create({
  button: {
    overflow: "hidden"
  }
});
