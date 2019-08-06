import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { IS_ANDROID } from "../utils/constants";
import {
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native-gesture-handler";

export default ({ children, ...rest }) => {
  if (IS_ANDROID)
    return (
      <TouchableNativeFeedback {...rest}>{children}</TouchableNativeFeedback>
    );
  else return <TouchableOpacity {...rest}>{children}</TouchableOpacity>;
};
