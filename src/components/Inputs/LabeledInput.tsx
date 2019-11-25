import React from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle
} from "react-native";
import UnderlinedTextInput, {
  UnderlinedTextInputProps
} from "./UnderlinedTextInput";
import { Text } from "../Text";
import colors from "../../styles/colors";

export interface LabeledInputProps extends UnderlinedTextInputProps {
  label?: string;
  inputContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const LabeledInput = ({
  containerStyle,
  inputContainerStyle,
  labelStyle,
  label,
  ...rest
}: LabeledInputProps) => {
  return (
    <View style={containerStyle}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <UnderlinedTextInput containerStyle={[inputContainerStyle]} {...rest} />
    </View>
  );
};

export default LabeledInput;

const styles = StyleSheet.create({
  label: {
    color: colors.primary,
    fontSize: 16,
    letterSpacing: 0.5,
    paddingBottom: 5
  }
});
