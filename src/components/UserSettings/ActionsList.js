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
import Divider from "../Divider";

export default class ActionsList extends Component {
  render() {
    const { logout } = this.props;

    return (
      <View
        style={{
          marginHorizontal: 20
        }}
      >
        <Section>
          <FullButton
            value={"Segnala"}
            onPress={this.bugReport}
            contentStyle={{ flex: 1, textAlign: "center" }}
            icon={"bug"}
            color={"darkRed"}
          />
        </Section>
        <Section>
          <FullButton
            value={"Passa a Civity PRO"}
            onPress={this.goCivityProInfo}
            contentStyle={{ flex: 1, textAlign: "center" }}
            style={{ marginBottom: 10 }}
            icon={"chevron-right"}
            color={"secondary"}
          />
          <FullButton
            value={"Invita un amico"}
            onPress={this.share}
            contentStyle={{ flex: 1, textAlign: "center", color: colors.black }}
            style={{ marginBottom: 10 }}
            color={"white"}
          />
          <FullButton
            value={"Logout"}
            onPress={logout}
            contentStyle={{ flex: 1, textAlign: "center", color: colors.black }}
            style={{ marginBottom: 10 }}
            color={"white"}
          />
        </Section>
      </View>
    );
  }

  share = () => {
    Share.open(shareOptions);
  };

  goBetaInfos = () => {
    this.props.navigation.navigate("BetaInfos");
  };

  goCivityProInfo = () => {
    this.props.navigation.navigate("CivityProInfo");
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
  url: "www.civityapp.it",
  message: "Entra in Civity!\n Compra e vendi i tuoi libri scolastici.\n",
  title: "Civity"
};

/**
 *         <SolidButton style={styles.actionButton} onPress={this.goBetaInfos}>
          <Header3 color="black" style={styles.actionText}>
            Informazioni Beta
          </Header3>
        </SolidButton>
 */

const Section = ({ style, children }) => {
  return <View style={[{ marginBottom: 20 }, style]}>{children}</View>;
};
