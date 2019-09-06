import React, { Component } from "react";
import { Text, View } from "react-native";
import { SellerInfoStyles as styles } from "./styles";
import { Header2, Header4, Header3 } from "../Text";
import Button from "../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import SolidButton from "../SolidButton";
import Divider from "../Divider";

export default props => {
  const { username } = props.data;
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Header2 color={"black"}>{username}</Header2>
        </View>
      </View>
      {!props.isPreview && (
        <View>
          <Divider style={{ marginVertical: 8 }}></Divider>
          <SolidButton
            icon="flag"
            iconSize={20}
            style={{ paddingVertical: 6 }}
            iconStyle={{ color: colors.darkRed }}
            onPress={props.reportItem}
          >
            <Header3 color="primary" numberOfLines={1}>
              Segnala
            </Header3>
          </SolidButton>
        </View>
      )}
    </View>
  );
};

/**
 * BETA COPIES
 * 
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

      <View style={styles.exploreIconContainer}>
          <Button>
            <Icon name="chevron-right" size={22} />
          </Button>
        </View>
 */
