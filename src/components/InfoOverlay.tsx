import React from "react";
import { View, TouchableWithoutFeedback, StyleSheet } from "react-native";

interface InfoOverlayProps {
  children: React.ReactNode;
  dismiss: () => void;
}

export default ({ children, dismiss }: InfoOverlayProps) => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
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
