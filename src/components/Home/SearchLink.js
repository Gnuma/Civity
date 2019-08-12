import React, { Component } from "react";
import { View } from "react-native";
import { Header3 } from "../Text";
import Button from "../Button";
import SolidButton from "../SolidButton";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import Shadows from "../Shadows";
export default props => {
  return (
    <View style={[{ flexDirection: "row" }, props.containerStyle]}>
      <SolidButton
        style={[
          {
            flex: 1,
            padding: 8,
            backgroundColor: "white",
            borderRadius: 6,
            ...Shadows[1]
          },
          props.style
        ]}
        icon="search"
        iconSize={20}
        onPress={props.onPress}
      >
        <Header3 style={{ color: "rgba(32, 32, 32, 0.6)" }}>
          Cerca un libro o una materia
        </Header3>
      </SolidButton>
    </View>
  );
};
