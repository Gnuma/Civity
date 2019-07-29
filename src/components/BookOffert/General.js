import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import ListMultiItem from "../ListItem/ListMultiItem";
import Card from "../Card";
import { Header2, Header3, Header4 } from "../Text";
import CircleValue from "../CircleValue";
import { getLevel, dateHourDisplay } from "../../utils/helper";
import {
  TextOffertStatus,
  TextFeedbackTypes,
  FEEDBACK_TYPES
} from "../../utils/constants";

export const OffertInfo = ({ item, user, offert, children }) => {
  console.log(item);
  console.log(user);
  console.log(offert);
  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      {item && <ListMultiItem data={item} isSingle={false} pk={item._id} />}
      {user && <UserCard userData={user} />}
      {offert && <OffertCard offert={offert} />}
      <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 5 }}>
        {children}
      </View>
    </ScrollView>
  );
};

export const DecisionBox = ({ children }) => {
  return <View style={{ margin: 10 }}>{children}</View>;
};

export const UserCard = ({ userData }) => {
  const { level, exp } = getLevel(userData.xp);
  const { office, user } = userData;
  return (
    <Card
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        marginBottom: 10
      }}
    >
      <View style={{ flex: 1 }}>
        <Header2 color="primary" numberOfLines={1}>
          {user.username}
        </Header2>
        <Header3 color="black" numberOfLines={1}>
          {office.name}
        </Header3>
        <Header4 color="black" numberOfLines={1}>
          {office.address}
        </Header4>
      </View>
      <CircleValue
        type={CircleValue.CircleValueType.LEVEL}
        value={level}
        experience={exp}
        radius={40}
      />
    </Card>
  );
};

export const OffertCard = ({ offert }) => {
  const dateString = dateHourDisplay(offert.createdAt);

  return (
    <Card style={{ marginHorizontal: 10, marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Header3 numberOfLines={1} color="primary" style={{ flex: 1 }}>
          Offerta:{" "}
          <Header3 numberOfLines={1} color="secondary">
            {TextOffertStatus[offert.status]}
          </Header3>
        </Header3>
        <Header4 color="black">{dateString}</Header4>
      </View>
      <Header3 style={{ marginTop: 8 }} color="black">
        {offert.creator.user.username} ha fatto un'offerta di{" "}
        <Header2 color="primary">EUR {offert.value}</Header2>
      </Header3>
    </Card>
  );
};
