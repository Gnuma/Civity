import React, { Component } from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";

export default class CodeInput extends Component {
  static propTypes = {
    code: PropTypes.array,
    onTextChange: PropTypes.func.isRequired
  };

  state = {
    focus: null
  };

  inputBoxes = {};

  textChange = (text, index) => {
    text = text.trim();
    let newCode = this.props.code;
    if (
      text.length >= this.props.code[index].length &&
      index < this.props.code.length - 1
    ) {
      this.inputBoxes[index + 1].focus();
    } else if (this.props.code[index].length > text.length && index > 0) {
      this.inputBoxes[index - 1].focus();
    }

    newCode[index] = text;
    this.props.onTextChange(newCode);
  };

  focusBox = index => {
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
