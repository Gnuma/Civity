import React, { Component } from "react";
import { Text, View } from "react-native";
import { Header3 } from "../Text";
import SolidButton from "../SolidButton";
import Card from "../Card";
import styles from "./styles";
import Share from "react-native-share";
import FullButton from "../FullButton";
import colors from "../../styles/colors";
import email from "react-native-email";

export default class ActionsList extends Component {
  render() {
    const { logout } = this.props;

    return (
      <View
        style={{
          marginHorizontal: 20
        }}
      >
        <FullButton
          value={"Segnala"}
          onPress={this.bugReport}
          style={{ marginBottom: 20 }}
          contentStyle={{ flex: 1, textAlign: "center" }}
          icon={"bug"}
          color={"darkRed"}
        />
        <SolidButton style={styles.actionButton} onPress={this.goBetaInfos}>
          <Header3 color="black" style={styles.actionText}>
            Informazioni Beta
          </Header3>
        </SolidButton>
        <SolidButton style={styles.actionButton} onPress={this.share}>
          <Header3 color="black" style={styles.actionText}>
            Invita un amico
          </Header3>
        </SolidButton>
        <SolidButton style={styles.actionButton} onPress={logout}>
          <Header3 color="black" style={styles.actionText}>
            Logout
          </Header3>
        </SolidButton>
      </View>
    );
  }

  share = () => {
    Share.open(shareOptions);
  };

  goBetaInfos = () => {
    this.props.navigation.navigate("BetaInfos");
  };

  bugReport = () => {
    const userData = this.props.userData;
    const to = ["civityapp@gmail.com"];
    const body =
      "Bug report di " +
      userData.username +
      ", " +
      this.props.id +
      " - " +
      new Date() +
      "\n\n" +
      "Specifica il tipo di segnalazione ('Malfunzionamento' o 'Miglioramento')\n";
    email(to, {
      subject: "Bug Report",
      body
    }).catch(console.log);
  };
}

const shareOptions = {
  url: "www.civity.it",
  message: "Entra in Civity!\n La 1ª app di annunci per libri scolastici.\n",
  title: "Civity"
};
