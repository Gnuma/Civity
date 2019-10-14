import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  StyleProp,
  ViewStyle
} from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";

interface CodeInputProps {
  code: string[];
  onTextChange: (code: string[]) => void;
  containerStyle: StyleProp<ViewStyle>;
}

interface CodeInputState {
  focus?: number | null;
}

export default class CodeInput extends Component<
  CodeInputProps,
  CodeInputState
> {
  static propTypes = {
    code: PropTypes.array,
    onTextChange: PropTypes.func.isRequired
  };

  inputBoxes: { [key: number]: TextInput | null } = {};

  state = {
    focus: null
  };

  textChange = (text: string, index: number) => {
    text = text.trim();
    let newCode = this.props.code;
    let input;
    if (
      text.length >= this.props.code[index].length &&
      index < this.props.code.length - 1
    ) {
      input = this.inputBoxes[index + 1];
    } else if (this.props.code[index].length > text.length && index > 0) {
      input = this.inputBoxes[index - 1];
    }
    input && input.focus();

    newCode[index] = text;
    this.props.onTextChange(newCode);
  };

  focusBox = (index: number) => {
    this.setState({ focus: index });
  };

  render() {
    const { code, containerStyle } = this.props;
    const { focus } = this.state;

    const styles = StyleSheet.create({
      inputBox: {
        flex: 1 / code.length,
        borderBottomWidth: 1,
        borderColor: colors.black,
        marginHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
      }
    });

    return (
      <View style={[{ flexDirection: "row" }, containerStyle]}>
        {code.map((value, index) => {
          return (
            <View
              style={[
                styles.inputBox,
                focus === index
                  ? {
                      borderColor: colors.primary,
                      borderBottomWidth: 2
                    }
                  : {}
              ]}
              key={index}
            >
              <TextInput
                style={{
                  fontSize: 20,
                  color: colors.black,
                  flex: 1,
                  textAlign: "center"
                }}
                value={value}
                onFocus={() => this.focusBox(index)}
                onChangeText={text => this.textChange(text, index)}
                maxLength={1}
                autoFocus={index == 0}
                keyboardType="number-pad"
                ref={ref => (this.inputBoxes[index] = ref)}
                selectTextOnFocus
              />
            </View>
          );
        })}
      </View>
    );
  }
}
