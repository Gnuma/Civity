import React, { Component } from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import styles, { ITEM_BORDER_RADIUS } from "./styles";
import { Header1, Header3, Header4, Header5 } from "../../components/Text";
import CircleValue from "../CircleValue";
import Image from "react-native-fast-image";
import { ___BASE_ENDPOINT___ } from "../../store/constants";
import { formatOffice } from "../../utils/helper";

export default class Item extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    isSingle: PropTypes.bool
  };
  render() {
    const { isSingle, data } = this.props;
    console.log(data);
    const { price, seller, condition, book, image_ad } = data;
    const office = seller.office || formatOffice(seller.course);
    let mainImage;
    try {
      mainImage = image_ad[0];
    } catch (error) {
      alert(error);
    }
    return (
      <View
        style={[
          styles.itemContainer,
          {
            borderTopLeftRadius: isSingle ? ITEM_BORDER_RADIUS : 0,
            borderTopRightRadius: isSingle ? ITEM_BORDER_RADIUS : 0
          }
        ]}
      >
        <Image
          style={[
            styles.image,
            {
              borderTopLeftRadius: isSingle ? ITEM_BORDER_RADIUS : 0
            }
          ]}
          source={{
            uri: mainImage
          }}
        />
        <View style={styles.itemContent}>
          <View style={styles.itemTopContent}>
            <View style={styles.leftColTopContent}>
              <Header3 color="black" numberOfLines={1}>
                {seller.user.username}
              </Header3>
              <Header1 color="primary">EUR {price}</Header1>
            </View>
            <View style={styles.m10}>
              <CircleValue value={condition} radius={40} />
            </View>
          </View>
          <View style={styles.itemBottomContent}>
            <Header4 color="black" numberOfLines={1}>
              {office.name}
            </Header4>
            <Header5 style={styles.ml15} numberOfLines={1}>
              {office.address}
            </Header5>
          </View>
        </View>
      </View>
    );
  }
}
