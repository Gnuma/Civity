import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, View, TextInput as RNTextInput, StyleSheet } from "react-native";
import colors from "../../styles/colors";
import { Header4 } from "../Text";

export default class TextInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string
  };

  render() {
    const {
      value,
      onChange,
      containerStyle,
      style,
      errorMessage,
      ...rest
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <RNTextInput
          value={value}
          onChange={onChange}
          style={[styles.primaryStyle]}
          {...rest}
        />
        <Header4 style={styles.error}>{errorMessage}</Header4>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  primaryStyle: {
    fontSize: 18,
    padding: 0,
    paddingLeft: 10,
    paddingBottom: 4,
    minWidth: 300,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary
  },
  error: {
    color: colors.red,
    paddingVertical: 2
  }
});
