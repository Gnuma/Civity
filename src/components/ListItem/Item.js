import React, { Component } from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import styles, { ITEM_BORDER_RADIUS, IS_SMALL_DEVICE } from "./styles";
import {
  Header1,
  Header3,
  Header4,
  Header5,
  Username
} from "../../components/Text";
import CircleValue from "../CircleValue";
import Image from "react-native-fast-image";
import { ___BASE_ENDPOINT___ } from "../../store/endpoints";
import { formatOffice } from "../../utils/helper";
import { ProBadge } from "../Badge";
import { UserType } from "../../utils/constants";

export default class Item extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    isSingle: PropTypes.bool
  };
  render() {
    const { isSingle, data } = this.props;
    //console.log(data);
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
        <View>
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
          <View style={styles.imageOverlay}>
            {seller.usertype === UserType.PRO && (
              <ProBadge
                style={{ borderBottomRightRadius: ITEM_BORDER_RADIUS }}
              ></ProBadge>
            )}
          </View>
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemTopContent}>
            <View style={styles.leftColTopContent}>
              <Username
                username={seller.user.username}
                userInfo={seller}
                containerStyle={{ marginTop: 5 }}
                size={20}
              />
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Header1
                  color="primary"
                  style={{ fontSize: IS_SMALL_DEVICE ? 23 : 27 }}
                >
                  EUR {price}
                </Header1>
              </View>
            </View>
            <View style={styles.m10}>
              <CircleValue
                value={condition}
                radius={IS_SMALL_DEVICE ? 36 : 40}
              />
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
