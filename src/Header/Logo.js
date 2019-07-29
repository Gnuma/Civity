import React, { Component } from "react";
import { View } from "react-native";
import styles from "./styles";
import { Header1 } from "../components/Text";

export default class Logo extends Component {
  render() {
    const { color } = this.props;
    return (
      <Header1 color={color || "white"} style={styles.logo}>
        Civity
      </Header1>
    );
  }
}
