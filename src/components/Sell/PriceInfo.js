import React, { Component } from "react";
import { Text, View } from "react-native";
import { Header2, Header3 } from "../Text";
import PriceInput from "./PriceInput";

export default class PriceInfo extends Component {
  render() {
    const { price } = this.props;
    return (
      <View
        style={{
          marginVertical: 5,
          marginHorizontal: 35,
          paddingHorizontal: 18,
          paddingVertical: 6,
          backgroundColor: "white",
          elevation: 4,
          borderRadius: 6
        }}
      >
        <Header3 color={"primary"}>Dai un prezzo al tuo libro</Header3>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20
          }}
        >
          <PriceInput onChangeText={this._local_handleChange} value={price} />
        </View>
      </View>
    );
  }

  _local_handleChange = text => {
    this.props.handleChange(text);
  };
}
