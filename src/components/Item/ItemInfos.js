import React, { Component } from "react";
import { View } from "react-native";
import { ItemInfoStyles as styles } from "./styles";
import { Header1, Header3, Header2 } from "../Text";
import CircleValue from "../CircleValue";
import { UserType } from "../../utils/constants";
import { ProBadge } from "../Badge";
import { ITEM_BORDER_RADIUS } from "../ListItem/styles";

export const PrimaryInfo = props => {
  const { price, conditions, office, usertype } = props.data;
  return (
    <View>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Header1 color={"primary"}>EUR {price}</Header1>
        </View>
        <View>
          {usertype == UserType.PRO && (
            <ProBadge
              style={{
                marginRight: 10,
                paddingHorizontal: 20,
                borderTopLeftRadius: ITEM_BORDER_RADIUS,
                borderBottomRightRadius: ITEM_BORDER_RADIUS
              }}
              size={18}
            />
          )}
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
      </View>
      <View style={styles.rightAlign}>
        <Header3 color={"black"}>{book.isbn}</Header3>
        <Header3 color={"black"}>{book.subject && book.subject.title}</Header3>
      </View>
    </View>
  );
};
