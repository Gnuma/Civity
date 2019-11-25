import React from "react";
import { View, StyleSheet } from "react-native";
import LabeldInput, { LabeledInputProps } from "./LabeledInput";
import { Text } from "../Text";
import colors from "../../styles/colors";

export interface PriceInputProps extends LabeledInputProps {}

const PriceInput = ({ ...rest }) => {
  return (
    <View>
      <Text style={styles.eur}>€</Text>
      <Text style={styles.decimal}>,00</Text>
      <LabeldInput style={styles.input} {...rest} keyboardType="numeric" />
    </View>
  );
};

export default PriceInput;

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 30,
    fontSize: 24,
    textAlign: "center"
  },
  eur: {
    color: colors.darkGrey,
    position: "absolute",
    bottom: 7,
    left: 10,
    fontSize: 18
  },
  decimal: {
    color: colors.darkGrey,
    position: "absolute",
    bottom: 7,
    right: 10,
    fontSize: 18
  }
});
