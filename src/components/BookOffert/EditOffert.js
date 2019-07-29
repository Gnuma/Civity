import React, { Component } from "react";
import { Text, View } from "react-native";
import { OffertInfo, DecisionBox } from "./General";
import Card from "../Card";
import { Header2, Header1, Header3 } from "../Text";
import FullButton from "../FullButton";

export default (EditOffert = ({ item, offert, removeOffert, UserTO }) => {
  return (
    <View style={{ flex: 1 }}>
      <OffertInfo item={item} user={UserTO} offert={offert}>
        <Header3 color="secondary" style={{ alignSelf: "center" }}>
          Aspettando che {UserTO.user.username} gestisca l'offerta inviata
        </Header3>
      </OffertInfo>
      <DecisionBox>
        <FullButton
          onPress={removeOffert}
          value="Rimuovi Offerta"
          icon="times"
          style={{ marginVertical: 4 }}
          contentStyle={{ flex: 1, textAlign: "center" }}
          color={"darkRed"}
        />
      </DecisionBox>
    </View>
  );
});
