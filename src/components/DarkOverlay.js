import React, { Component } from "react";
import { Text, View, Animated, StyleSheet } from "react-native";
import colors from "../styles/colors";

export default class DarkOverlay extends Component {
  render() {
    const { animatedValue, min, max } = this.props;

    return (
      <Animated.View
        style={[
          { ...StyleSheet.absoluteFill, bacgroundColor: colors.black },
          {
            opacity: animatedValue.interpolate({
              inputRange: [min, max],
              outputRange: [min, max],
              extrapolate: "clamp"
            })
          }
        ]}
      />
    );
  }
}
