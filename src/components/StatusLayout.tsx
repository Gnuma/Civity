import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import colors from "../styles/colors";
import Shadows from "./Shadows";
import GoBackButton from "./Touchables/GoBackButton";
import { Header3, Text, Header2 } from "./Text";
import Button from "./Touchables/Button";

export type StatusLayoutViewType = {
  renderView: () => React.ReactNode;
  title: string;
};

interface StatusLayoutProps {
  views: { renderView: () => React.ReactNode; title: string }[];
  state: number;
  goBack: () => void;
  onContinue: () => void;
}

const StatusLayout = ({
  state,
  views,
  goBack,
  onContinue
}: StatusLayoutProps) => {
  const view = views[state];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <GoBackButton goBack={goBack} />
        <Header2 color="black">{view.title}</Header2>
      </View>
      <View style={styles.content}>{view.renderView()}</View>
      <View style={styles.actionContainer}>
        <View style={styles.button}>
          <Button type="secondary" value="Indietro" onPress={goBack} />
        </View>
        <View style={styles.button}>
          <Button type="primary" value={"Continua "} onPress={onContinue}>
            <Text style={styles.buttonCounter}>
              ({state + 1}/{views.length})
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StatusLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    backgroundColor: colors.white,
    ...Shadows[3],
    alignItems: "center",
    flexDirection: "row",
    height: 60
  },
  content: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 20
  },
  actionContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  button: {
    flex: 1
  },
  buttonCounter: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white
  }
});
