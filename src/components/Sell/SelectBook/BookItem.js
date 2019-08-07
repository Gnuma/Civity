import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Header3, Header4, Header5, Header2 } from "../../Text";
import Button from "../../Button";
import Image from "react-native-fast-image";

export default class BookItem extends Component {
  render() {
    const { title, author, isbn, subject } = this.props.data;
    return (
      <Button
        onPress={this._local_handleSelection}
        disabled={this.props.disabled}
        style={{
          flex: 1,
          flexDirection: "row",
          borderRadius: 10,
          backgroundColor: "white",
          elevation: 4,
          marginVertical: 6,
          marginHorizontal: 15,
          overflow: "hidden"
        }}
      >
        <View style={{ flex: 1, margin: 5 }}>
          <View style={{ alignItems: "center" }}>
            <Header2 color={"primary"}>{title}</Header2>
            <Header4 numberOfLines={1} style={{ marginLeft: 10 }}>
              {author}
            </Header4>
          </View>
          <View
            style={{
              flex: 1,
              margin: 4,
              flexDirection: "row"
            }}
          >
            <View style={{ flex: 1, alignItems: "flex-end", marginRight: 10 }}>
              <Header4>ISBN</Header4>
              <Header4>Materia</Header4>
            </View>
            <View style={{ flex: 1, alignItems: "flex-start", marginLeft: 10 }}>
              <Header4>{isbn}</Header4>
              <Header4>{subject.title}</Header4>
            </View>
          </View>
        </View>
        {this.props.disabled && (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: "rgba(0,0,0,0.8)",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Header2 color="white">Già in vendita</Header2>
          </View>
        )}
      </Button>
    );
  }

  _formatYears = year => {
    switch (year) {
      case 1:
        return "I";
      case 2:
        return "II";
      case 3:
        return "III";
      case 4:
        return "IV";
      case 5:
        return "V";
      default:
        return "Non specificato";
    }
  };

  _local_handleSelection = () => {
    this.props.handleSelection(this.props.data);
  };
}
