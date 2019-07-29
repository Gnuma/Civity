import React, { Component } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Button from "../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import colors from "../../styles/colors";

export default class OutlinedInput extends Component {
  static propTypes = {
    onTextChange: PropTypes.func,
    value: PropTypes.string,
    icon: PropTypes.string,
    placeholder: PropTypes.string,
    inputType: PropTypes.string,
    inputStyle: PropTypes.any,
    containerStyle: PropTypes.any,
    borderFocus: PropTypes.bool,
    isPhone: PropTypes.bool,
    hideClearButton: PropTypes.bool
  };

  state = {
    focused: false
  };

  _onChange = text => {
    this.props.onTextChange(text);
  };

  _focusInput = () => {
    this.input.focus();
  };

  onButtonPress = () => {
    this._focusInput();
    if (!this.props.hideClearButton && this.props.value) this._onChange("");
  };

  _setInputRef = input => {
    this.input = input;
  };

  onFocus = () => {
    this.setState({
      focused: true
    });
    this.props.onFocus && this.props.onFocus();
  };

  onBlur = () => {
    this.setState({
      focused: false
    });
    this.props.onBlur && this.props.onBlur();
  };

  render() {
    const {
      style,
      placeholder,
      inputType,
      inputStyle,
      containerStyle,
      borderFocus,
      hideClearButton,

      onFocus,
      onBlur,

      ...rest
    } = this.props;
    let { value } = this.props;

    const icon =
      !hideClearButton && this.state.focused && value
        ? "times"
        : this.props.icon;

    return (
      <View
        style={[
          {
            margin: 8,
            flexDirection: "row"
          },
          containerStyle
        ]}
      >
        <View style={{ flex: 1, elevation: 0, flexDirection: "row" }}>
          <TextInput
            style={[
              {
                flex: 1,
                fontSize: 18,
                padding: 8,
                elevation: 4,
                backgroundColor: "white",
                justifyContent: "center",
                borderBottomLeftRadius: 6,
                borderTopLeftRadius: 6
              },
              inputStyle
            ]}
            placeholder={placeholder}
            onChangeText={this._onChange}
            ref={this._setInputRef}
            keyboardType={inputType}
            {...rest}
            value={value}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
          <Button
            style={{
              width: 50,
              backgroundColor: "white",
              elevation: 5,
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={this.onButtonPress}
          >
            {icon == "pen" ? (
              <Icon5 name={icon} size={22} style={{ color: colors.black }} />
            ) : (
              <Icon
                name={icon}
                size={22}
                style={{
                  color: icon == "check" ? colors.secondary : colors.black
                }}
              />
            )}
          </Button>
        </View>
      </View>
    );
  }
}

OutlinedInput.defaultProps = {
  icon: "pen"
};
