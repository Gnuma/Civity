import React, { Component } from "react";
import { Text, View } from "react-native";
import SolidButton from "../SolidButton";
import Image from "react-native-fast-image";
import { Header2, Header1, Header3 } from "../Text";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import Button from "../Button";
import { TextOffertStatus } from "../../utils/constants";

export default ({ offert, item, goBookOffert }) => {
  return (
    <SolidButton
      style={{
        flexDirection: "row",
        marginHorizontal: 10
      }}
      onPress={goBookOffert}
    >
      <View style={{ flex: 1 / 5 }}>
        <Image
          style={{ flex: 1, borderRadius: 6 }}
          source={{ uri: item.image_ad[0] }}
          resizeMode={"cover"}
        />
      </View>
      <View style={{ flex: 4 / 5, paddingHorizontal: 5 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Header2
            color={"primary"}
            numberOfLines={1}
            style={{ flex: 1, marginRight: 5 }}
          >
            {item.book.title}
          </Header2>
          <Icon
            name={"chevron-right"}
            size={18}
            style={{ color: colors.black }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Header2 color={"primary"} numberOfLines={1} style={{ flex: 1 }}>
            EUR {offert.value}
          </Header2>
          <Header3 color="secondary" numberOfLines={1}>
            {TextOffertStatus[offert.status]}
          </Header3>
        </View>
      </View>
    </SolidButton>
  );
};
