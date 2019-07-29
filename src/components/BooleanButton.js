import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import Button from "./Button";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../styles/colors";

export default ({
  containerStyle,
  positiveStyle,
  positiveIcon = "check",
  positiveSize = 24,
  negativeStyle,
  negativeIcon = "times",
  negativeSize = 24,
  onPress = () => {}
}) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          backgroundColor: "white",
          elevation: 4,
          borderRadius: 6
        },
        containerStyle
      ]}
    >
      <Button onPress={() => onPress(true)}>
        <Icon
          name={positiveIcon}
          style={[
            {
              color: colors.primary,
              paddingHorizontal: 14,
              paddingVertical: 5,
              borderRightWidth: 0.5,
              borderColor: colors.grey
            },
            positiveStyle
          ]}
          size={positiveSize}
        />
      </Button>
      <Button onPress={() => onPress(false)}>
        <Icon
          name={negativeIcon}
          style={[
            {
              color: colors.darkRed,
              paddingHorizontal: 14,
              paddingVertical: 5
            },
            negativeStyle
          ]}
          size={negativeSize}
        />
      </Button>
    </View>
  );
};
