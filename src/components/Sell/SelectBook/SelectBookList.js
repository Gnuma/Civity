import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";
import BookItem from "./BookItem";
import { Header2, Header3 } from "../../Text";
import Button from "../../Button";

export default class SelectBookList extends Component {
  render() {
    const { results, hasNoResults, goCreateBook } = this.props;
    if (hasNoResults) {
      return (
        <Button
          style={{
            flexDirection: "row",
            borderRadius: 10,
            backgroundColor: "white",
            elevation: 4,
            marginVertical: 6,
            marginHorizontal: 15
          }}
          onPress={goCreateBook}
        >
          <Header3 color={"primary"} style={{ margin: 10 }}>
            Nessun risultato per il tuo libro <Header2>Aggiungilo</Header2>
          </Header3>
        </Button>
      );
    }

    return (
      <FlatList
        style={{ flex: 1 }}
        data={results}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        keyboardShouldPersistTaps={"handled"}
      />
    );
  }

  _keyExtractor = item => {
    return item.isbn;
  };

  _renderItem = ({ item }) => {
    return (
      <BookItem
        data={item}
        handleSelection={this.props.handleSelection}
        disabled={!!this.props.soldBooks[item.isbn]}
      />
    );
  };
}
