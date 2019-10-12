import React, { Component } from "react";
import {
  View,
  GestureResponderEvent,
  StyleProp,
  ViewStyle
} from "react-native";
import SolidButton from "./SolidButton";
import { Header3 } from "./Text";

interface ContinueButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  text: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export default ({
  onPress,
  text,
  disabled,
  containerStyle,
  ...rest
}: ContinueButtonProps) => {
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
