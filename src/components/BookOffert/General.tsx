import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import ListMultiItem from "../ListItem/ListMultiItem";
import Card from "../Card";
import { Header2, Header3, Header4 } from "../Text";
import { getLevel, dateHourDisplay } from "../../utils/helper";
import {
  TextOffertStatus,
  TextFeedbackTypes,
  FEEDBACK_TYPES
} from "../../utils/constants";
import UsernameInfo from "../UsernameInfo";
import { UserData, GeneralUser } from "../../types/ProfileTypes";
import { GeneralItem } from "../../types/ItemTypes";
import { GeneralOffert } from "../../store/chat_Deprecated/types";

export interface FullOffertProps {
  item?: GeneralItem;
  user?: GeneralUser;
  offert?: GeneralOffert;
}

interface OffertInfoProps extends FullOffertProps {
  children?: React.ReactNode;
}

export const OffertInfo = ({
  item,
  user,
  offert,
  children
}: OffertInfoProps) => {
  console.log(item);
  console.log(user);
  console.log(offert);

  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <View style={{ paddingBottom: 10 }}>
        {item && <ListMultiItem data={item} isSingle={false} pk={item._id} />}
      </View>
      {user && <UserCard userData={user} />}
      {offert && <OffertCard offert={offert} />}
      <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 5 }}>
        {children}
      </View>
    </ScrollView>
  );
};

export const DecisionBox = ({ children }: { children: React.ReactNode }) => {
  return <View style={{ margin: 10 }}>{children}</View>;
};

export const UserCard = ({ userData }: { userData: GeneralUser }) => {
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
        <Header3 color="black" numberOfLines={2}>
          {office.name}
        </Header3>
        <Header4 color="black" numberOfLines={1}>
          {office.address}
        </Header4>
      </View>
      <UsernameInfo
        size={80}
        userInfo={userData}
        style={{ marginLeft: 10 }}
      ></UsernameInfo>
    </Card>
  );
};

export const OffertCard = ({ offert }: { offert: GeneralOffert }) => {
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
