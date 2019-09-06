import React, { Component } from "react";
import { View } from "react-native";
import { ItemInfoStyles as styles } from "./styles";
import { Header1, Header3, Header2 } from "../Text";
import CircleValue from "../CircleValue";

export const PrimaryInfo = props => {
  const { price, conditions, office } = props.data;
  return (
    <View>
      <View style={styles.row}>
        <View>
          <Header1 color={"primary"}>EUR {price}</Header1>
        </View>
      </View>
      <View style={styles.conditionOfficeContainer}>
        <View>
          <CircleValue value={conditions} radius={45} />
        </View>
        <View style={styles.rightAlign}>
          <Header2 color={"secondary"} numberOfLines={2}>
            {office.name}
          </Header2>
          <Header3 numberOfLines={1}>{office.address}</Header3>
        </View>
      </View>
    </View>
  );
};

export const DescriptionInfo = props => {
  return (
    <View style={styles.descriptionContainer}>
      <Header3 style={styles.textCenterAlign} color={"black"}>
        {props.data}
      </Header3>
    </View>
  );
};

export const SecondaryInfo = props => {
  const { book } = props.data;
  return (
    <View style={styles.secondaryInfoContainer}>
      <View>
        <Header3>ISBN</Header3>
        <Header3>Materia</Header3>
        <Header3>Anno</Header3>
      </View>
      <View style={styles.rightAlign}>
        <Header3 color={"black"}>{book.isbn}</Header3>
        <Header3 color={"black"}>{book.subject && book.subject.title}</Header3>
        <Header3 color={"black"}>{book.year}</Header3>
      </View>
    </View>
  );
};
