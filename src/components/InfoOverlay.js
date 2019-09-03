import React from "react";
import { View, TouchableWithoutFeedback, StyleSheet } from "react-native";

export default ({ children, dismiss }) => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.8)"
      }}
    >
      <TouchableWithoutFeedback onPress={dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {children}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
