import React, { Component } from "react";
import { View, FlatList } from "react-native";
import { Header3 } from "../Text";
import Button from "../Button";
import PropTypes from "prop-types";
import styles from "./styles";
import colors from "../../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";

export class SearchResults extends Component {
  render() {
    const { suggestions, searchHistory, searchQuery } = this.props;
    return (
      <FlatList
        keyboardShouldPersistTaps={"handled"}
        data={searchQuery ? suggestions : searchHistory.order}
        renderItem={this.renderItem}
        keyExtractor={this._keyExtractor}
      />
    );
  }

  renderItem = ({ item }) => {
    const { searchHistory } = this.props;
    console.log(searchHistory);
    return (
      <Button
        style={{
          padding: 15,
          flexDirection: "row"
        }}
        onPress={() => this.goSearch(item)}
      >
        <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
          <Icon
            name={searchHistory.keys[item.isbn] ? "history" : "search"}
            size={24}
            style={{ color: colors.black }}
          />
          <Header3
            style={{ paddingLeft: 15, color: colors.black }}
            numberOfLines={1}
          >
            {item.title}
          </Header3>
        </View>
      </Button>
    );
  };

  goSearch = searchOptions => {
    this.props.searchRedux(searchOptions);
  };

  _keyExtractor = (item, index) => {
    return index.toString();
  };
}

export default SearchResults;
