import React from "react";
import {
  View,
  Text,
  TextStyle,
  StyleProp,
  ViewStyle,
  StyleSheet
} from "react-native";
import colors from "../../styles/colors";

export interface LabeledFieldProps {
  label?: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const LabeledField = ({
  label,
  style,
  containerStyle,
  children
}: LabeledFieldProps) => {
  return (
    <View style={containerStyle}>
      <Text style={[styles.label, style]}>{label}</Text>
      {children}
    </View>
  );
};

export default LabeledField;

const styles = StyleSheet.create({
  label: {
    color: colors.primary,
    fontSize: 16,
    letterSpacing: 0.5,
    paddingBottom: 5
  }
});
