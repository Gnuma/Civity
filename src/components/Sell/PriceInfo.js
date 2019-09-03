import React, { Component } from "react";
import { Text, View } from "react-native";
import { Header2, Header3 } from "../Text";
import PriceInput from "./PriceInput";
import Shadows from "../Shadows";
import Card from "../Card";

export default class PriceInfo extends Component {
  render() {
    const { price } = this.props;
    return (
      <Card>
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
      </Card>
    );
  }

  _local_handleChange = text => {
    this.props.handleChange(text);
  };
}
