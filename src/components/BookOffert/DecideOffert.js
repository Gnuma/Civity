import React from "react";
import { View } from "react-native";
import { OffertInfo, DecisionBox } from "./General";
import Card from "../Card";
import { Header3, Header2, Header1 } from "../Text";
import FullButton from "../FullButton";

export default (DecideOffert = ({
  item,
  offert,
  UserTO,
  rejectOffert,
  acceptOffert
}) => {
  console.log(item, offert);
  return (
    <View style={{ flex: 1 }}>
      <OffertInfo item={item} user={UserTO} offert={offert}>
        <Header3 color="secondary" style={{ alignSelf: "center" }}>
          Gestisci l'offerta inviata da {UserTO.user.username}
        </Header3>
      </OffertInfo>
      <DecisionBox>
        <FullButton
          value="Rifiuta"
          onPress={rejectOffert}
          icon="times"
          style={{ marginVertical: 4 }}
          contentStyle={{ flex: 1, textAlign: "center" }}
          color={"darkRed"}
        />
        <FullButton
          value="Accetta"
          onPress={acceptOffert}
          icon="check"
          style={{ marginBottom: 6 }}
          contentStyle={{ flex: 1, textAlign: "center" }}
        />
      </DecisionBox>
    </View>
  );
});
