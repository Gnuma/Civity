import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { OffertInfo, DecisionBox } from "./General";
import Card from "../Card";
import { Header2, Header1, Header3 } from "../Text";
import FullButton from "../FullButton";
import { FEEDBACK_TYPES, TextFeedbackTypes } from "../../utils/constants";

export default ({ item, offert, UserTO }) => {
  return (
    <View style={{ flex: 1 }}>
      <OffertInfo item={item} user={UserTO} offert={offert} />
      <View
        style={{
          ...StyleSheet.absoluteFill,
          backgroundColor: "rgba(0,0,0,0.75)",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Header3 color="white" style={{ margin: 20 }}>
          L'inserzione non esiste più. Potrebbe essere stata eliminata o venduta
          ad un'altro utente.
        </Header3>
      </View>
    </View>
  );
};
