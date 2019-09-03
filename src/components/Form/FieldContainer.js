import React, { Fragment } from "react";
import { Text, View } from "react-native";
import ErrorMessage from "./ErrorMessage";

export default ({ error, children }) => {
  return (
    <View style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 5 }}>
      {!!error && (
        <ErrorMessage
          message={error}
          containerStyle={{
            padding: 8,
            marginVertical: 4,
            marginHorizontal: 0
          }}
        />
      )}
      {children}
    </View>
  );
};
