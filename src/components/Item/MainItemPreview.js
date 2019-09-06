import React, { Component } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { MainItemStyles as styles } from "./styles";
import ImageSlider from "./ImageSlider";
import { PrimaryInfo, DescriptionInfo, SecondaryInfo } from "./ItemInfos";
import SellerInfo from "./SellerInfo";
import Divider from "../Divider";

export default class MainItemPreview extends Component {
  render() {
    const { data } = this.props;
    const primaryData = {
      price: data.price,
      conditions: data.condition,
      office: data.seller.office
    };
    const sellerData = data.seller.user;
    const secondaryData = {
      book: data.book
    };
    console.log(data);

    return (
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={"handled"}
      >
        <ImageSlider style={styles.imageSlider} data={data.image_ad} />
        <View style={styles.content}>
          <PrimaryInfo data={primaryData} />
          <SellerInfo data={sellerData} isPreview />
          <DescriptionInfo data={data.description} />
          <Divider style={styles.smallDivider} />
          <SecondaryInfo data={secondaryData} />
        </View>
      </ScrollView>
    );
  }
}
