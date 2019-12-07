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
  warning?: string;
}

const LabeledInput = ({
  containerStyle,
  inputContainerStyle,
  labelStyle,
  label,
  warning,
  ...rest
}: LabeledInputProps) => {
  return (
    <View style={containerStyle}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        <Text style={[styles.warning]}>{warning}</Text>
      </View>
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
    paddingBottom: 5,
    paddingRight: 10
  },
  labelContainer: {
    flexDirection: "row"
  },
  warning: {
    color: colors.darkRed,
    fontSize: 16,
    letterSpacing: 0.5,
    paddingBottom: 5,
    flex: 1,
    textAlign: "right"
  }
});
