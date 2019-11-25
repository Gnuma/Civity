import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleProp,
  TextInputProps,
  ViewStyle,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputFocusEventData
} from "react-native";
import colors from "../../styles/colors";

export interface UnderlinedTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const UnderlinedTextInput = ({
  style,
  containerStyle,
  onFocus: remoteFocus,
  onBlur: remoteBlur,
  ...rest
}: UnderlinedTextInputProps) => {
  const [focused, setFocused] = useState(false);
  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    remoteFocus && remoteFocus(e);
  };
  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    remoteBlur && remoteBlur(e);
  };
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={colors.grey}
        style={[styles.field, style]}
        {...rest}
      />
      <View style={styles.lineContainer}>
        <View style={focused ? styles.lineFocused : styles.lineUnfocused} />
      </View>
    </View>
  );
};

export default UnderlinedTextInput;

const styles = StyleSheet.create({
  container: {},
  field: {
    fontSize: 18,
    padding: 1,
    paddingHorizontal: 13,
    paddingVertical: 3
  },
  lineContainer: {
    height: 2,
    justifyContent: "flex-end"
  },
  lineFocused: {
    height: 2,
    backgroundColor: colors.secondary
  },
  lineUnfocused: {
    height: 1.5,
    backgroundColor: colors.grey
  }
});
