import React, { Component } from "react";
import { View } from "react-native";
import SolidButton from "./SolidButton";
import { Header3 } from "./Text";

export default ({ onPress, text, disabled, containerStyle, ...rest }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row"
        },
        containerStyle
      ]}
    >
      <SolidButton
        style={{ flex: 1 }}
        onPress={onPress}
        disabled={disabled}
        {...rest}
      >
        <Header3
          style={{ flex: 1, textAlign: "center" }}
          color={disabled ? "black" : "secondary"}
        >
          {text}
        </Header3>
      </SolidButton>
    </View>
  );
};
