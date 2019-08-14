import React, { Component } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import BookItem from "./BookItem";
import { Header2, Header3 } from "../../Text";
import Button from "../../Button";
import Shadows from "../../Shadows";

export default class SelectBookList extends Component {
  render() {
    const { results, loading } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {loading && (
          <ActivityIndicator
            style={{ alignSelf: "center", margin: 20 }}
            size="large"
          />
        )}
        <FlatList
          data={results}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          keyboardShouldPersistTaps={"handled"}
          ListFooterComponent={this.renderFooter}
        />
      </View>
    );
  }

  renderFooter = () => {
    return (
      <Button
        style={{
          borderRadius: 10,
          backgroundColor: "white",
          ...Shadows[4],
          marginTop: 6,
          marginHorizontal: 15,
          padding: 5,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20
        }}
        onPress={this.props.goCreateBook}
      >
        <Header3>Non trovi il tuo libro?</Header3>
        <Header2 color={"primary"}>Aggiungilo</Header2>
      </Button>
    );
  };

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
