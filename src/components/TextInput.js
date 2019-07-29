import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextInput as RTI } from "react-native";

export class TextInput extends Component {
  render() {
    return <RTI {...this.props} />;
  }
}

export default TextInput;
