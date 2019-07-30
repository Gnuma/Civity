import React, { Component } from "react";
import { View } from "react-native";
import { Header2 } from "../Text";

export default () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Header2 color="black" style={{ margin: 20 }}>
        Non dovresti essere qui. Fuggi, sciocco.
      </Header2>
    </View>
  );
};
