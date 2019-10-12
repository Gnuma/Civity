import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import colors from "../styles/colors";
import { Header2, Header3 } from "./Text";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "./Button";

interface StatusBarProps {
  data: string[];
  status: number;
  goBack: (keys?: any) => void;
}

export const StatusBar = ({ data, status, goBack }: StatusBarProps) => {
  let statusText = data[status];
  const showGoBack = goBack && status > 0;

  const styles = StyleSheet.create({
    activeStatus: {
      flex: 1 / data.length,
      borderBottomWidth: 1,
      borderColor: colors.secondary,
      margin: 5
    },
    inactiveStatus: {
      flex: 1 / data.length,
      borderBottomWidth: 1,
      borderColor: colors.grey,
      margin: 5
    }
  });

  return (
    <View style={{ marginVertical: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          height: 30
        }}
      >
        <View
          style={{
            width: showGoBack ? 40 : 20
          }}
        >
          {showGoBack && (
            <Button
              style={{ borderRadius: 20, padding: 2, alignSelf: "center" }}
              onPress={goBack}
            >
              <Icon
                name="chevron-circle-left"
                size={26}
                style={{ color: colors.black }}
              />
            </Button>
          )}
        </View>
        <Header3 color={"primary"}>{statusText}</Header3>
      </View>
      <View style={{ flexDirection: "row" }}>
        {data.map((state, index) => {
          return (
            <View
              key={index}
              style={
                status >= index ? styles.activeStatus : styles.inactiveStatus
              }
            />
          );
        })}
      </View>
    </View>
  );
};
