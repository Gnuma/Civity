import React, { useState, useRef } from "react";
import {
  View,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle
} from "react-native";
import colors from "../../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import { TouchableOpacity, TextInput } from "react-native-gesture-handler";

export interface TextInputFieldProps extends TextInputProps {
  containerStyle: StyleProp<ViewStyle>;
  icon: React.ReactNode;
}

const TextInputField = ({
  style,
  containerStyle,
  value,
  icon,
  onChangeText,
  ...rest
}: TextInputFieldProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        style={[styles.input, style]}
        {...rest}
      />
      <TouchableOpacity onPress={() => onChangeText && onChangeText("")}>
        {!value ? (
          icon || <Icon5 name="pen" size={25} style={styles.icon} />
        ) : (
          <Icon name="times" size={25} style={styles.icon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TextInputField;

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    backgroundColor: colors.lighLighGrey,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    paddingLeft: 13,
    fontSize: 16,
    flex: 1
  },
  icon: {
    color: colors.black
  }
});
