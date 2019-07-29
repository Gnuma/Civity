import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export class Button extends Component {
  render() {
    let opacity = this.props.disabled ? 1 : 0.8;
    if (this.props.disabled) {
      return (
        <View
          activeOpacity={opacity}
          onPress={this.props.onPress}
          style={this.props.style}
        >
          {this.props.children}
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          activeOpacity={opacity}
          onPress={this.props.onPress}
          style={this.props.style}
        >
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}

Button.defaultProps = { disabled: false };

export default Button;
