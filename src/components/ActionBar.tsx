import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import colors from "../styles/colors";
import Button, { ButtonProps } from "./Touchables/Button";

interface ActionBarProps {
  goBack: () => void;
  onContinue: () => void;
  backProps?: ButtonProps;
  continueProps?: ButtonProps;
  backChildren?: React.ReactNode;
  continueChildren?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const ActionBar = ({
  goBack,
  onContinue,
  backProps,
  continueProps,
  backChildren,
  continueChildren,
  containerStyle
}: ActionBarProps) => {
  return (
    <View style={[styles.actionContainer, containerStyle]}>
      <View style={styles.button}>
        <Button
          type="secondary"
          value="Indietro"
          onPress={goBack}
          {...backProps}
        >
          {backChildren}
        </Button>
      </View>
      <View style={styles.button}>
        <Button
          type="primary"
          value={"Continua"}
          onPress={onContinue}
          {...continueProps}
        >
          {continueChildren}
        </Button>
      </View>
    </View>
  );
};

export default ActionBar;

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row"
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
