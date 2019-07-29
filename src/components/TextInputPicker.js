import React, { Component } from "react";
import { Text, View, TextInput, FlatList, Keyboard } from "react-native";
import PropTypes from "prop-types";
import Button from "./Button";
import colors from "../styles/colors";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import { Header3 } from "./Text";
import Divider from "./Divider";
import NativeButton from "../components/NativeButton";

export default class TextInputPicker extends Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.array,
    placeholder: PropTypes.string,

    onTextChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    renderOption: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      text: props.value
    };
  }

  setActive = () =>
    this.setState({
      isActive: true
    });

  _onBlur = () => {
    this.setState({
      isActive: false,
      text: this.props.value || ""
    });
  };

  _focusInput = () => {
    this.input && this.input.focus();
  };

  onButtonPress = () => {
    if (this.state.isActive) {
      this.onTextChange("");
    } else {
      this._focusInput();
    }
  };

  onSelection = item => {
    this.setState({
      isActive: false
    });
    this.props.onSelect(item);
    Keyboard.dismiss();
  };

  onTextChange = text => {
    this.setState({ text });
    this.props.onTextChange(text);
  };

  render() {
    const { isActive, text } = this.state;
    const { options, style, placeholder } = this.props;
    let icon;
    if (isActive && text) {
      icon = "times";
    } else if (this.props.value) {
      icon = "check";
    } else {
      icon = "pen";
    }

    return (
      <View style={[{ padding: 8 }, style]}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={{
              flex: 1,
              fontSize: 18,
              padding: 8,
              elevation: 4,
              backgroundColor: "white",
              justifyContent: "center",
              borderBottomLeftRadius: 6,
              borderTopLeftRadius: 6
            }}
            placeholder={placeholder}
            onFocus={this.setActive}
            onBlur={this._onBlur}
            onChangeText={this.onTextChange}
            value={text}
            ref={input => (this.input = input)}
          />
          <View
            style={{
              width: 50,
              backgroundColor: "white",
              elevation: 5,
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6
            }}
          >
            <Button
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={this.onButtonPress}
            >
              <Icon5
                name={icon}
                size={22}
                style={{
                  color: icon == "check" ? colors.secondary : colors.black
                }}
              />
            </Button>
          </View>
        </View>
        {isActive ? (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 6,
              elevation: 3,
              maxHeight: 140,
              marginTop: -10,
              overflow: "hidden",
              flexDirection: "row"
            }}
          >
            <FlatList
              style={{
                marginTop: 10,
                borderRadius: 6,
                backgroundColor: "white"
              }}
              keyboardShouldPersistTaps="handled"
              data={options}
              renderItem={this._renderOption}
              keyExtractor={this._keyExtractor}
            />
          </View>
        ) : null}
      </View>
    );
  }

  _keyExtractor = (item, index) => {
    return index.toString();
  };

  _renderOption = ({ item, index }) => {
    return (
      <View>
        <NativeButton onPress={() => this.onSelection(item)}>
          {this.props.renderOption(item)}
        </NativeButton>
        {index !== this.props.options.length - 1 && (
          <Divider style={{ marginHorizontal: 20 }} />
        )}
      </View>
    );
  };
}
