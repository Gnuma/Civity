import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import styles from "./styles";
import Logo from "./Logo";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";

export default class HomeHeader extends Component {
  render() {
    const { openSettings } = this.props;

    return (
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <Button onPress={openSettings} style={{ padding: 10, borderRadius: 6 }}>
          <Icon name="gear" size={24} style={styles.icon} />
        </Button>
      </View>
    );
  }
}
