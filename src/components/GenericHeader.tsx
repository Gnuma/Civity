import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Header2 } from "./Text";
import GoBackButton from "./Touchables/GoBackButton";
import { NavigationContext } from "react-navigation";
import Shadows from "./Shadows";
import colors from "../styles/colors";

interface GenericHeaderProps {
  title?: string;
  goBack?: () => void;
}

const GenericHeader = ({ title, goBack: remoteGoBack }: GenericHeaderProps) => {
  const navigation = useContext(NavigationContext);
  const goBack = () => {
    if (remoteGoBack) remoteGoBack();
    else navigation.goBack(null);
  };

  return (
    <View style={styles.headerContainer}>
      <GoBackButton goBack={goBack} />
      <Header2 color="black">{title}</Header2>
    </View>
  );
};

export default GenericHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    ...Shadows[3],
    alignItems: "center",
    flexDirection: "row",
    height: 60
  }
});
