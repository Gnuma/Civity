import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableNativeFeedbackProps
} from "react-native";
import { IS_ANDROID } from "../utils/constants";
import {
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native-gesture-handler";

interface Props {
  children: React.ReactNode;
  rest: TouchableNativeFeedbackProps;
}

export default ({ children, ...rest }: Props) => {
  if (IS_ANDROID)
    return (
      <TouchableNativeFeedback {...rest}>{children}</TouchableNativeFeedback>
    );
  else return <TouchableOpacity {...rest}>{children}</TouchableOpacity>;
};
