import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";
import PaginationDot from "../PaginationDot";

export default class BookShelfPagination extends Component {
  render() {
    const { data, focus } = this.props;
    return (
      <FlatList
        renderItem={this._renderItem}
        data={data}
        keyExtractor={this._keyExtractor}
        horizontal
        extraData={{ focus }}
        contentContainerStyle={{
          justifyContent: "center",
          flex: 1,
          alignItems: "center"
        }}
      />
    );
  }

  _renderItem = ({ item, index }) => {
    return <PaginationDot focused={index === this.props.focus} />;
  };

  _keyExtractor = (item, index) => index.toString();
}
