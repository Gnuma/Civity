import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Header3 } from "./Text";
import colors from "../styles/colors";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";

export default ({
  style,
  contentStyle,
  value,
  color = "secondary",
  icon,
  iconStyle,
  iconSize = 22,
  disabled,
  ...rest
}) => {
  if (disabled) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.lightGrey
          },
          styles.container,
          style
        ]}
      >
        <Header3 color="white" style={contentStyle}>
          {value}
        </Header3>
        {icon &&
          (icon === "pen" ? (
            <Icon5
              name={icon}
              size={iconSize}
              style={[styles.icon, iconStyle]}
            />
          ) : (
            <Icon
              name={icon}
              size={iconSize}
              style={[styles.icon, iconStyle]}
            />
          ))}
      </View>
    );
  } else {
    return (
      <TouchableNativeFeedback
        {...rest}
        style={[
          {
            backgroundColor: colors[color]
          },
          styles.container,
          style
        ]}
        background={TouchableNativeFeedback.Ripple("white", false)}
      >
        <Header3 color="white" style={contentStyle}>
          {value}
        </Header3>
        {icon &&
          (icon === "pen" ? (
            <Icon5
              name={icon}
              size={iconSize}
              style={[styles.icon, iconStyle]}
            />
          ) : (
            <Icon
              name={icon}
              size={iconSize}
              style={[styles.icon, iconStyle]}
            />
          ))}
      </TouchableNativeFeedback>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 8,
    elevation: 2
  },

  icon: {
    position: "absolute",
    alignSelf: "center",
    right: 10,
    color: colors.white
  }
});
