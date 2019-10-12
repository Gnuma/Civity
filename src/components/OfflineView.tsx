import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Header3 } from "./Text";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../styles/colors";

interface OfflineViewProps {
  shopping?: boolean;
  sales?: boolean;
}

export default class OfflineView extends Component<OfflineViewProps> {
  render() {
    const { shopping, sales } = this.props;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginHorizontal: 20,
          marginTop: 20
        }}
      >
        <Icon name={"warning"} size={50} style={{ color: colors.red }} />
        <View style={{ flex: 1, marginTop: 10 }}>
          <Header3 color="black">
            Impossibile scaricare i dati{" "}
            {sales ? "sulle tue vendite" : "sui tuoi acquisti"} non avendo
            connessione ad Internet
          </Header3>
        </View>
        <OfflineNotification />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export const OfflineNotification = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View
        style={{
          marginTop: 5,
          marginBottom: 20,
          borderWidth: 1,
          borderRadius: 6,
          borderColor: colors.primary,
          flexDirection: "row"
        }}
      >
        <Header3
          color="red"
          style={{ flex: 1, textAlign: "center", padding: 5 }}
        >
          Impossibile connettersi ad Internet
        </Header3>
      </View>
    </View>
  );
};
