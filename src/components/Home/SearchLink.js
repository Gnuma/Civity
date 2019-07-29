import React, { Component } from "react";
import { View } from "react-native";
import { Header3 } from "../Text";
import Button from "../Button";
import SolidButton from "../SolidButton";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";

export default props => {
  return (
    <SolidButton
      style={[
        {
          minWidth: 320,
          padding: 8,
          elevation: 4,
          backgroundColor: "white",
          borderRadius: 6
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
  );
};
