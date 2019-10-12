import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextInput as RTI, TextProps } from "react-native";

export class TextInput extends Component<TextProps> {
  render() {
    return <RTI {...this.props} />;
  }
}

export default TextInput;
