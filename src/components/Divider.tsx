import React, { Component } from "react";
import { View, StyleProp, ViewStyle } from "react-native";

interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

export default function Divider(props: DividerProps) {
  return (
    <View
      style={[
        {
          borderBottomColor: "#C8C8C8",
          borderBottomWidth: 1
        },
        props.style
      ]}
    />
  );
}
