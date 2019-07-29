import React, { Component } from "react";
import { Text, View, Animated, FlatList } from "react-native";
import colors from "../../styles/colors";
import PaginationDot from "../PaginationDot";

export default class SalePagination extends Component {
  render() {
    const { data, focus, fullData } = this.props;
    return (
      <FlatList
        renderItem={this._renderItem}
        data={data}
        keyExtractor={this._keyExtractor}
        horizontal
        extraData={{ focus, fullData }}
        contentContainerStyle={{
          justifyContent: "center",
          height: 20,
          flex: 1,
          alignItems: "center"
        }}
      />
    );
  }

  _renderItem = ({ item }) => {
    return (
      <PaginationDot
        focused={this.props.data[this.props.focus].itemID === item.itemID}
        hasNews={this.props.fullData[item.itemID].newsCount > 0}
      />
    );
  };

  _keyExtractor = (item, index) => item.itemID.toString();
}
