import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { HiddenBar } from "./StatusBars";
import Logo from "../Header/Logo";
import IconPlus from "../media/vectors/plus-icon";
import colors from "../styles/colors";
import Shadows from "./Shadows";

const SplashScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <HiddenBar />
      <Logo color="black" />
      <View style={styles.icon}>
        <IconPlus width="38em" height="38em" />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  icon: {
    marginVertical: 10,
    height: 50,
    width: 50,
    backgroundColor: colors.black,
    ...Shadows[2],
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  }
});
