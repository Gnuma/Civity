import React, { Component } from "react";
import { View, ScrollView, StyleSheet, Linking } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Header1, Header3, Header2 } from "./Text";

import FullButton from "./FullButton";
import colors from "../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";

import BasicHeader from "./BasicHeader";
import { TouchableOpacity } from "react-native-gesture-handler";
import IOSToast from "./IOSToast";

export default ({ onPress }: { onPress: () => void }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <IOSToast>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Header1 color={"primary"} style={{ fontSize: 50 }}>
              Ciao!
            </Header1>
            <Header3 color={"black"} style={{ marginBottom: 20 }}>
              Benvenuto in Civity
            </Header3>
            <View style={styles.content}>
              <Header3 color={"black"} style={styles.center}>
                Per offrirti il miglior servizio possibile, questa applicazione
                utilizza cookie e tecnologie per offrirti servizi e contenuti in
                linea con le tue preferenze
              </Header3>
              <Header3
                color={"black"}
                style={[styles.center, { marginTop: 10 }]}
              >
                Utilizzando questa applicazione accetti il nostro accordo per
                gli utenti
              </Header3>
              <TouchableOpacity onPress={openTerms}>
                <Header3 color="primary" style={{ paddingVertical: 5 }}>
                  Termini e condizioni
                </Header3>
              </TouchableOpacity>
            </View>
          </View>
          <FullButton
            onPress={onPress}
            value="Avanti"
            icon="chevron-right"
            style={{ marginVertical: 15 }}
            iconStyle={{
              color: colors.white
            }}
            contentStyle={{
              flex: 1,
              textAlign: "center",
              color: colors.white
            }}
            color={"secondary"}
          />
        </View>
      </IOSToast>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    paddingTop: 20,
    paddingHorizontal: 18
  },
  content: {
    flex: 1 / 2,
    alignItems: "center",
    justifyContent: "center"
  },
  center: {
    textAlign: "center"
  }
});

const ___TERMS_URL___ = "http://www.civityapp.it/terms";

const openTerms = () => {
  Linking.canOpenURL(___TERMS_URL___)
    .then(() => Linking.openURL(___TERMS_URL___))
    .catch(() => {
      IOSToast.dispatchToast(
        "Impossibile aprire http://www.civityapp.it/terms"
      );
    });
};
