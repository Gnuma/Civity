import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import Card from "../Card";
import colors from "../../styles/colors";
import { Header3 } from "../Text";

export default class BlockedItemBar_Deprecated extends Component {
  render() {
    return (
      <Card
        style={{
          position: "absolute",
          backgroundColor: colors.darkRed,
          flexDirection: "row"
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Header3 color="white">Questa inserzione non esite più.</Header3>
          <Header3 color="white">
            Può essere stata venduta o cancellata.
          </Header3>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({});
