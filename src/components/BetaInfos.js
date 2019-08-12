import React, { Component } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Header1, Header3, Header2 } from "./Text";

import FullButton from "./FullButton";
import colors from "../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";

export default ({ onPress }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.firstSection}>
            <Header1 style={styles.title}>
              Grazie <Header3 color="black">per la partecipazione alla</Header3>
            </Header1>
            <Header1 style={styles.title}>
              Beta <Header3 color="black">di </Header3>
              Civity
            </Header1>
            <Header3 color="black" style={{ marginTop: 15 }}>
              Questa versione sarà disponibile dal
            </Header3>
            <Header3 color="black">
              <Header3 color="primary" style={styles.bold}>
                13/08/2019{" "}
              </Header3>
              al{" "}
              <Header3 color="primary" style={styles.bold}>
                20/08/2019
              </Header3>
            </Header3>
            <Header3 color="black" style={[styles.center, styles.top15]}>
              Durante questo tempo avrai la possibilità di provare
              l’applicazione essendo così parte dello sviluppo della
              piattaforma.
            </Header3>
            <Header3 color="black" style={[styles.center, styles.top15]}>
              In cambio del tuo aiuto, se riuscirai a completare i seguenti
              obbiettivi entro la scadenza indicata, riceverai{" "}
              <Header3 color="black" style={styles.bold}>
                in regalo{" "}
              </Header3>
              l’abbonamento{" "}
              <Header3 color="black" style={styles.bold}>
                Civity PRO
              </Header3>{" "}
              per la durata di un anno.
            </Header3>
          </View>

          <View style={styles.section}>
            <Header2 color="primary" style={styles.sectionHeader}>
              Obbiettivi
            </Header2>
            <List>
              <Header3 color="black">
                <Header3 color="black" style={styles.bold}>
                  Creare{" "}
                </Header3>
                un account.
              </Header3>
              <View>
                <Header3 color="black">
                  <Header3 color="black" style={styles.bold}>
                    Pubblicare 2 annunci{" "}
                  </Header3>
                  di vendita.
                </Header3>
                <Header3 color="black">
                  ATTENZIONE almeno uno dei due dovrà essere riferito ad uno dei
                  seguenti libri:
                </Header3>
                <Header3 color="black">Matematica blu 1</Header3>
                <Header3 color="black">Il piacere dei testi 3</Header3>
                <Header3 color="black">Performer heritage 1</Header3>
                <Header3 color="black">La parola alla storia 2</Header3>
              </View>
              <Header3 color="black">
                <Header3 color="black" style={styles.bold}>
                  Completare il processo di acquisto{" "}
                </Header3>
                almeno un libro della precedente lista
              </Header3>
            </List>
          </View>
          <View style={styles.section}>
            <Header2 color="primary" style={styles.sectionHeader}>
              Contributo
            </Header2>
            <Header3 color="black">
              Questa versione dell’applicazione non è ancora stabile e per
              questo probabilmente durante l’utilizzo riscontrerai diversi
              malfunzionamenti.
            </Header3>
            <Header3 color="black" style={{ marginVertical: 10 }}>
              Proprio qui{" "}
              <Header3 color="black" style={styles.bold}>
                chiediamo il tuo aiuto.
              </Header3>
            </Header3>
            <Header3 color="black">
              Nella sezione impostazioni, accessibile tramite l’icona{" "}
              <Icon name="gear" size={20} />, avrai la possibilità di inviarci
              un’email facendoci sapere i problemi riscontrati e potendo così
              contribuire al miglioramento della piattaforma.
            </Header3>
          </View>
          <View style={styles.section}>
            <Header2 color="primary" style={styles.sectionHeader}>
              Ricerche
            </Header2>
            <Header3 color="black">
              In alcuni casi non riuscirai a trovare il libro o l’istituto che
              stavi cercando. Questo perchè in questo momento i dati a nostra
              disposizione non sono ancora completi.
            </Header3>
            <Header3 color="black">
              In queste situazioni ti basterà però cercare direttamente una tra
              le seguenti risorse disponibili
            </Header3>
            <List listRow={styles.helperListRowContainer}>
              <View>
                <Header3 color="black" style={styles.bold}>
                  Libri
                </Header3>
                <Header3 color="black">Matematica blu 1</Header3>
                <Header3 color="black">Il piacere dei testi 3</Header3>
                <Header3 color="black">Performer heritage 1</Header3>
                <Header3 color="black">La parola alla storia 2</Header3>
              </View>
              <View>
                <Header3 color="black" style={styles.bold}>
                  Istituti
                </Header3>
                <Header3 color="black">
                  Liceo scientifico statale Orazio
                </Header3>
                <Header3 color="black">Liceo scientifico E. Fermi</Header3>
                <Header3 color="black">I. C. ‘Dante Alighieri’ Ferrara</Header3>
                <Header3 color="black">Liceo Immanuel Kant</Header3>
              </View>
              <View>
                <Header3 color="black" style={styles.bold}>
                  Libri
                </Header3>
                <Header3 color="black">Matematica</Header3>
                <Header3 color="black">Letteratura</Header3>
                <Header3 color="black">Inglese</Header3>
                <Header3 color="black">Storia</Header3>
              </View>
            </List>
          </View>
          <FullButton
            value="Inizia"
            style={{ marginHorizontal: 15, marginVertical: 20 }}
            contentStyle={{ textAlign: "center", flex: 1 }}
            onPress={onPress}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 36,
    lineHeight: 36,
    color: colors.primary,
    marginVertical: 5
  },
  firstSection: {
    marginHorizontal: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10
  },
  bold: {
    fontWeight: "700"
  },
  center: {
    textAlign: "center"
  },
  top15: {
    marginTop: 15
  },
  section: {
    marginTop: 20,
    marginHorizontal: 15
  },
  sectionHeader: {
    marginBottom: 10
  },
  listContainer: {
    flex: 1
  },
  listRow: {
    flexDirection: "row",
    marginBottom: 4
  },
  listRowIcon: {
    width: 10
  },
  helperListRowContainer: {
    marginTop: 10
  }
});

const List = ({ children, listRow }) => {
  return (
    <View style={styles.listContainer}>
      {children.map(function(item, i) {
        return (
          <View key={i} style={[styles.listRow, listRow]}>
            <View style={styles.listRowIcon}>
              <Header3 color="black" style={styles.bold}>
                -
              </Header3>
            </View>
            {item}
          </View>
        );
      })}
    </View>
  );
};
