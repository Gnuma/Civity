import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Header2, Header3 } from "../Text";
import PriceInfo from "./PriceInfo";
import ConditionsInfo from "./ConditionsInfo";
import DescriptionInfo from "./DescriptionInfo";
import Button from "../Button";
import Shadows from "../Shadows";
import FieldContainer from "../Form/FieldContainer";

export default class MainSell extends Component {
  render() {
    const {
      conditions,
      price,
      description,
      setField,
      handleComplete
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, marginTop: 18 }}>
          <FieldContainer error={price.errorMessage}>
            <PriceInfo
              price={price.value}
              handleChange={v => setField("price", v)}
            />
          </FieldContainer>
          <FieldContainer error={conditions.errorMessage}>
            <ConditionsInfo
              conditions={conditions.value}
              handleChange={v => setField("conditions", v)}
            />
          </FieldContainer>
          <FieldContainer error={description.errorMessage}>
            <DescriptionInfo
              description={description.value}
              handleChange={v => setField("description", v)}
            />
          </FieldContainer>
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
    ...Shadows[4],
    flex: 0,
    flexDirection: "row"
  },
  buttonText: {
    flex: 1,
    textAlign: "center"
  }
});
