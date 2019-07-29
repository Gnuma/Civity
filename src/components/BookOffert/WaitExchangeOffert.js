import React, { Component } from "react";
import { Text, View } from "react-native";
import { OffertInfo, DecisionBox } from "./General";
import Card from "../Card";
import { Header2, Header1, Header3 } from "../Text";
import FullButton from "../FullButton";

export default (WaitExchangeOffert = ({ item, offert, UserTO }) => {
  return (
    <View style={{ flex: 1 }}>
      <OffertInfo item={item} user={UserTO} offert={offert}>
        <Header3 color="secondary" style={{ alignSelf: "center" }}>
          Aspettando che {UserTO.user.username} segnali il completamento dello
          scambio per terminare la transazione
        </Header3>
      </OffertInfo>
    </View>
  );
});
