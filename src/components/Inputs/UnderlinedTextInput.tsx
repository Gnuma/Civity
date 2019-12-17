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
import { Header3 } from "../Text";

export interface UnderlinedTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  prefix?: string;
  inputRef?: refType;
}

const UnderlinedTextInput = ({
  style,
  containerStyle,
  onFocus: remoteFocus,
  onBlur: remoteBlur,
  prefix,
  inputRef,
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
      {prefix && <Header3 style={styles.prefix}>{prefix}</Header3>}
      <TextInput
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={colors.grey}
        style={[
          styles.field,
          !!prefix && { paddingLeft: 13 + 15 * prefix.length },
          style
        ]}
        ref={inputRef}
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
  },
  prefix: {
    position: "absolute",
    bottom: 7,
    left: 13
  }
});

type refType =
  | ((instance: TextInput | null) => void)
  | React.RefObject<TextInput>
  | null
  | undefined;
