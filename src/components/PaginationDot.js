import React, { Component } from "react";
import { View, Animated, StyleSheet } from "react-native";
import colors from "../styles/colors";

const width = 8;
const minHeight = 12;
const maxHeight = 18;

export default class PaginationDot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: new Animated.Value(props.focused ? 1 : 0)
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.focused !== this.props.focused) {
      Animated.timing(this.state.value, {
        toValue: this.props.focused ? 1 : 0,
        duration: 100
      }).start();
    }
  }

  render() {
    return (
      <Animated.View
        style={{
          width: width,
          height: this.state.value.interpolate({
            inputRange: [0, 1],
            outputRange: [minHeight, maxHeight],
            extrapolate: "clamp"
          }),
          marginHorizontal: this.state.value.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 5],
            extrapolate: "clamp"
          }),
          borderColor: this.state.value.interpolate({
            inputRange: [0, 1],
            outputRange: [
              this.props.hasNews ? colors.darkRed : colors.black,
              colors.black
            ],
            extrapolate: "clamp"
          }),
          opacity: this.state.value.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
            extrapolate: "clamp"
          }),
          borderWidth: 1.5,
          borderRadius: 4,
          overflow: "hidden"
        }}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: this.state.value.interpolate({
              inputRange: [0, 1],
              outputRange: [
                this.props.hasNews ? colors.darkRed : colors.white,
                colors.black
              ],
              extrapolate: "clamp"
            })
          }}
        />
      </Animated.View>
    );
  }
}
