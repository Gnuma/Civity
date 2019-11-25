import React, { Component } from "react";
import { Text, View, ScrollView, TextInput } from "react-native";
import { Header1, Header3 } from "../Text";
import colors from "../../styles/colors";

export default class PriceInput extends Component {
  onBlur = event => {
    if (this.props.value == "") {
      this.props.onChangeText && this.props.onChangeText("0");
    }
    this.props.onBlur && this.props.onBlur(event);
  };

  render() {
    const { containerStyle, setPriceRef, style, onBlur, ...rest } = this.props;
    return (
      <View
        style={[
          {
            flex: 0,
            alignItems: "baseline",
            flexDirection: "row"
          },
          containerStyle
        ]}
      >
        <Header1
          color={"primary"}
          style={{
            marginRight: 10
          }}
        >
          EUR
        </Header1>
        <TextInput
          style={[
            {
              fontSize: 26,
              paddingHorizontal: 16,
              paddingVertical: 2,
              borderColor: colors.primary,
              borderWidth: 2,
              borderTopRightRadius: 6,
              borderTopLeftRadius: 6,
              color: colors.primary,
              textAlign: "center"
            },
            style
          ]}
          {...rest}
          maxLength={2}
          blurOnSubmit={true}
          keyboardType="numeric"
          placeholder={"00"}
          ref={setPriceRef}
          onBlur={this.onBlur}
        />
        <Header3
          style={{ alignSelf: "flex-start", paddingTop: 2, paddingLeft: 4 }}
          color={"primary"}
        >
          00
        </Header3>
      </View>
    );
  }
}
