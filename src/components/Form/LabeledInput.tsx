import React, { Component } from "react";
import { Text, StyleSheet, View, ViewStyle } from "react-native";
import PropTypes from "prop-types";
import { Header4 } from "../Text";
import OutlinedInput, { OutlinedInputProps } from "./OutlinedInput";
import ErrorMessage from "./ErrorMessage";
import colors from "../../styles/colors";
import { FieldState } from "../../utils/constants";

interface LabeledInputProps extends OutlinedInputProps {
  inputContainerStyle?: ViewStyle;
  label?: string;
  state: FieldState;
  style?: ViewStyle;
}

export default class LabeledInput extends Component<LabeledInputProps> {
  static propTypes = {
    onTextChange: PropTypes.func,
    state: PropTypes.object,
    icon: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    inputType: PropTypes.string,
    inputContainerStyle: PropTypes.any,
    borderFocus: PropTypes.bool,
    containerStyle: PropTypes.any
  };

  render() {
    const {
      containerStyle,
      inputContainerStyle,
      style,
      label,
      placeholder,
      state,
      ...rest
    } = this.props;

    return (
      <View style={containerStyle}>
        <Header4 color="black" style={styles.label} numberOfLines={1}>
          {label || placeholder}
        </Header4>
        <OutlinedInput
          {...rest}
          value={state.value}
          inputStyle={{ ...styles.input, ...style }}
          containerStyle={inputContainerStyle}
        />
        {!!state.errorMessage && <ErrorMessage message={state.errorMessage} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    marginLeft: 20
  },
  input: {
    color: colors.primary
  }
});
