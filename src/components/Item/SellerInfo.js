import React, { Component } from "react";
import { Text, View } from "react-native";
import { SellerInfoStyles as styles } from "./styles";
import { Header2, Header4 } from "../Text";
import Button from "../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import SolidButton from "../SolidButton";

export default props => {
  const { username } = props.data;
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Header2 color={"black"}>{username}</Header2>
        </View>
        <View style={styles.exploreIconContainer}>
          <Button>
            <Icon name="chevron-right" size={22} />
          </Button>
        </View>
      </View>
      <View style={styles.buttonListContainer}>
        <SolidButton icon="heart" iconSize={20}>
          <Header4 color={"primary"}>Salva Venditore</Header4>
        </SolidButton>
        <SolidButton icon="star" iconSize={20}>
          <Header4 color={"primary"}>Salva Inserzione</Header4>
        </SolidButton>
        <SolidButton icon="exclamation-triangle" iconSize={20}>
          <Header4 color={"primary"}>Segnala Inserzione</Header4>
        </SolidButton>
      </View>
    </View>
  );
};
