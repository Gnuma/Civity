import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Header3, Header4, Header5, Header2 } from "../../Text";
import Button from "../../Button";
import Image from "react-native-fast-image";

const itemHeight = 130;

export default class BookItem extends Component {
  render() {
    const { title, img, authors, isbn, subject } = this.props.data;
    const year = this._formatYears(this.props.year);
    return (
      <Button
        onPress={this._local_handleSelection}
        disabled={this.props.disabled}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            height: itemHeight,
            borderRadius: 10,
            backgroundColor: "white",
            elevation: 4,
            marginVertical: 6,
            marginHorizontal: 15,
            overflow: "hidden"
          }}
        >
          <Image
            style={{
              height: itemHeight,
              width: 122,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10
            }}
            source={require("../../../media/imgs/logo-w-title.png")}
          />
          <View style={{ flex: 1, margin: 5 }}>
            <View style={{ flex: 0 }}>
              <Header3 color={"primary"}>{title}</Header3>
              <Header5 numberOfLines={1} style={{ marginLeft: 10 }}>
                {authors}
              </Header5>
            </View>
            <View style={{ flex: 1, marginTop: 10, flexDirection: "row" }}>
              <View>
                <Header4>ISBN</Header4>
                <Header4>Materia</Header4>
                <Header4>Anno</Header4>
              </View>
              <View style={{ flex: 1, marginLeft: 20 }}>
                <Header4>{isbn}</Header4>
                <Header4>{subject}</Header4>
                <Header4>{year}</Header4>
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
        </View>
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
