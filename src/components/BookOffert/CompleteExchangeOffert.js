import React from "react";
import { View } from "react-native";
import { OffertInfo, DecisionBox } from "./General";
import Card from "../Card";
import { Header3, Header2, Header1 } from "../Text";
import FullButton from "../FullButton";

export default (CompleteExchangeOffert = ({
  item,
  offert,
  UserTO,
  setComplete
}) => {
  console.log(item, offert);
  return (
    <View style={{ flex: 1 }}>
      <OffertInfo item={item} user={UserTO} offert={offert}>
        <Header3 color="secondary" style={{ alignSelf: "center" }}>
          Una volta completato lo scambio termina la transazione con{" "}
          {UserTO.user.username}
        </Header3>
      </OffertInfo>
      <DecisionBox>
        <FullButton
          value="Completa scambio"
          onPress={setComplete}
          icon="check"
          style={{ marginBottom: 6 }}
          contentStyle={{ flex: 1, textAlign: "center" }}
        />
      </DecisionBox>
    </View>
  );
});
