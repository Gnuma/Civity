import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Header3, Header4 } from "../Text";
import Button from "../Button";
import colors from "../../styles/colors";
import Shadows from "../Shadows";
import Card from "../Card";

export default class DescriptionInfo extends Component {
  render() {
    const { description } = this.props;
    return (
      <Card>
        <Header3 color={"primary"}>Aggiungi una piccola descrizione</Header3>
        <View>
          <Header4 color={"primary"}>
            {"\u2022"} Ci sono degli evidenti segni di usura?
          </Header4>
          <Header4 color={"primary"}>
            {"\u2022"} Ha delle scritte e/o sono stati fatti gli esercizi?
          </Header4>
          <Header4 color={"primary"}>
            {"\u2022"} Il prezzo è trattabile?
          </Header4>
        </View>
        <View
          style={{
            marginVertical: 10,
            borderColor: colors.primary,
            borderWidth: 2,
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,

            padding: 10
          }}
        >
          <TextInput
            style={{
              flex: 1,
              fontSize: 14,
              padding: 0,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              textAlignVertical: "top"
            }}
            multiline={true}
            maxLength={280}
            numberOfLines={5}
            value={description}
            onChangeText={this._local_handleChange}
            placeholder={
              "E.G. Libro Matematica Verde 3 in condizioni ottime, presenta solo qualche ammaccature nelle pagine finali, gli esercizi sono solti sul libro quindi è scritto il prezzo è trattabile contattatemi in privato."
            }
          />
          <Header4 style={{ alignSelf: "flex-end" }}>
            {description.length}/280
          </Header4>
        </View>
      </Card>
    );
  }

  _local_handleChange = text => {
    this.props.handleChange(text);
  };
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 35,
    paddingHorizontal: 18,
    paddingVertical: 6,
    backgroundColor: "white",
    ...Shadows[4],
    borderRadius: 6
  }
});
