import React, { useRef, createRef } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInput
} from "react-native";
import UnderlinedTextInput from "./UnderlinedTextInput";
import update from "immutability-helper";

interface CodeInputProps {
  code: string[];
  onTextChange: (code: string[]) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const CodeInput = ({ code, containerStyle, onTextChange }: CodeInputProps) => {
  const refs = useRef(
    [...Array(code.length)].map(() => createRef<TextInput>())
  );

  const onChangeDigit = (text: string, index: number) => {
    if (text !== "" && isNaN(parseInt(text))) return;
    onTextChange(
      update(code, {
        [index]: { $set: text }
      })
    );
    console.log(code[index + 1]);
    if (text && index + 1 !== code.length && !code[index + 1].trim()) {
      refs.current[Math.min(index + 1, code.length - 1)].current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <UnderlinedTextInput
          value={digit}
          inputRef={refs.current[index]}
          onChangeText={text => onChangeDigit(text, index)}
          containerStyle={[
            styles.input,
            index === code.length - 1 && { marginRight: 0 }
          ]}
          style={styles.inputText}
          maxLength={1}
          keyboardType="number-pad"
          selectTextOnFocus
          onFocus={() => onChangeDigit("", index)}
          key={index.toString()}
        />
      ))}
    </View>
  );
};

export default CodeInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  input: {
    marginRight: 10
  },
  inputText: {
    textAlign: "center"
  }
});
