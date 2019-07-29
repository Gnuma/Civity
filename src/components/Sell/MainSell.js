import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Header2, Header3 } from "../Text";
import PriceInfo from "./PriceInfo";
import ConditionsInfo from "./ConditionsInfo";
import DescriptionInfo from "./DescriptionInfo";
import Button from "../Button";

export default class MainSell extends Component {
  render() {
    const {
      conditions,
      price,
      description,
      setPrice,
      setDescription,
      setConditions,
      handleComplete
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, marginTop: 18 }}>
          <PriceInfo price={price} handleChange={setPrice} />
          <ConditionsInfo
            conditions={conditions}
            handleChange={setConditions}
          />
          <DescriptionInfo
            description={description}
            handleChange={setDescription}
          />
        </ScrollView>
        <Button style={[styles.button]} onPress={handleComplete}>
          <Header3 style={styles.buttonText} color={"primary"}>
            Vai al riepilogo
          </Header3>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    marginVertical: 8,
    paddingVertical: 10,
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 6,
    elevation: 4,
    flex: 0,
    flexDirection: "row"
  },
  buttonText: {
    flex: 1,
    textAlign: "center"
  }
});
