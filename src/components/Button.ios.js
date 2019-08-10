import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export class Button extends Component {
  render() {
    const { disabled, onPress, style, children, ...rest } = this.props;
    let opacity = disabled ? 1 : 0.5;
    if (disabled) {
      return <View style={style}>{children}</View>;
    } else {
      return (
        <TouchableOpacity
          activeOpacity={opacity}
          onPress={onPress}
          style={style}
          {...rest}
        >
          {children}
        </TouchableOpacity>
      );
    }
  }
}

Button.defaultProps = { disabled: false };

export default Button;
