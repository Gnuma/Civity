import React from "react";
import {
  View,
  Text,
  TextInputProps,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import colors from "../../styles/colors";

export interface ComposerProps extends TextInputProps {
  onSend: (text?: string) => void;
  value: string;
  onChangeText: (text: string) => void;
}
const Composer = ({
  onSend: remoteOnSend,
  value,
  onChangeText,
  ...rest
}: ComposerProps) => {
  const onSend = () => {
    value && remoteOnSend(value);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.toolbar}>
        <ScrollView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline
            placeholder={"Send a message"}
            value={value}
            onChangeText={onChangeText}
            {...rest}
          />
        </ScrollView>
        <TouchableOpacity style={styles.btn} onPress={onSend}>
          <Text style={styles.btnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Composer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white
  },
  toolbar: {
    marginVertical: 8,
    marginHorizontal: 8,
    padding: 6,
    flexDirection: "row",
    borderRadius: 6,
    backgroundColor: colors.lighLighGrey
  },
  btnText: {
    fontSize: 14,
    color: "#0645AD"
  },
  btn: {
    justifyContent: "center",
    alignSelf: "center",
    padding: 4
  },
  inputContainer: {
    maxHeight: 130,
    padding: 4
  },
  input: {
    flex: 1,
    fontSize: 17,
    padding: 0
  }
});
