import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { Header4 } from "../Text";
import OutlinedInput from "./OutlinedInput";
import ErrorMessage from "./ErrorMessage";
import colors from "../../styles/colors";

export default class LabeledInput extends Component {
  static propTypes = {
    onTextChange: PropTypes.func,
    state: PropTypes.object,
    icon: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    inputType: PropTypes.string,
    inputContainerStyle: PropTypes.any,
    borderFocus: PropTypes.bool
  };

  render() {
    return (
      <View>
        <Header4 color="black" style={styles.label} numberOfLines={1}>
          {this.props.label || this.props.placeholder}
        </Header4>
        <OutlinedInput
          {...this.props}
          value={this.props.state.value}
          inputStyle={[styles.input, this.props.style]}
          containerStyle={this.props.inputContainerStyle}
        />
        {!!this.props.state.errorMessage && (
          <ErrorMessage message={this.props.state.errorMessage} />
        )}
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
