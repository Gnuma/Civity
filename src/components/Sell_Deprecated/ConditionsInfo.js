import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Header2, Header3 } from "../Text";
import colors from "../../styles/colors";
import SolidButton from "../SolidButton";
import Shadows from "../Shadows";
import Card from "../Card";

export default class ConditionsInfo extends Component {
  render() {
    const { conditions } = this.props;
    return (
      <Card>
        <Header3 color={"primary"}>
          Seleziona le condizioni del tuo libro
        </Header3>
        <View
          style={{
            marginVertical: 15,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SolidButton
            style={{
              borderColor: conditions === 0 ? colors.secondary : "white",
              borderWidth: 2
            }}
            onPress={this._setOttimo}
          >
            <Header3 style={styles.buttonText} color={"secondary"}>
              Ottimo
            </Header3>
          </SolidButton>
          <SolidButton
            style={{
              borderColor: conditions === 1 ? colors.lightYellow : "white",
              borderWidth: 2
            }}
            onPress={this._setBuono}
          >
            <Header3 style={styles.buttonText} color={"lightYellow"}>
              Buono
            </Header3>
          </SolidButton>
          <SolidButton
            style={{
              borderColor: conditions === 2 ? colors.red : "white",
              borderWidth: 2
            }}
            onPress={this._setUsato}
          >
            <Header3 style={styles.buttonText} color={"red"}>
              Usato
            </Header3>
          </SolidButton>
        </View>
      </Card>
    );
  }

  _setOttimo = () => {
    this.props.handleChange(0);
  };
  _setBuono = () => {
    this.props.handleChange(1);
  };
  _setUsato = () => {
    this.props.handleChange(2);
  };
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    marginHorizontal: 35,
    paddingHorizontal: 18,
    paddingVertical: 6,
    backgroundColor: "white",
    ...Shadows[4],
    borderRadius: 6
  },
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
