import React, { Component } from "react";
import { View } from "react-native";

export default function Divider(props) {
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
