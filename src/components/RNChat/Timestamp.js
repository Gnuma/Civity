import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Settings from "./Settings";

export default ({ timestamp }) => {
  return (
    <Text style={styles.date}>
      {timestamp.getDate() +
        " " +
        Settings.MONTHS[timestamp.getMonth()] +
        " " +
        timestamp.getFullYear()}
    </Text>
  );
};

export const dispalyTime = timestamp => {
  return (
    addZeros(String(timestamp.getHours())) +
    ":" +
    addZeros(String(timestamp.getMinutes()))
  );
};

export const addZeros = str => {
  if (str.length < 2) return "0" + str;
  else return str;
};

export const getFullDate = date =>
  date.getDate() + "" + date.getMonth() + "" + date.getFullYear();

const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    fontWeight: "500",
    alignSelf: "center",
    marginVertical: 4
  }
});
