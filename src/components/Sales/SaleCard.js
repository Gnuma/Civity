import React, { Component } from "react";
import { Text, View, Platform, StyleSheet } from "react-native";
import { ParallaxImage } from "react-native-snap-carousel";
import Image from "react-native-fast-image";
import { itemWidth, itemHorizontalMargin, imgHeight } from "./styles";
import { Header1, Header3, Header2, Header5 } from "../Text";
import colors from "../../styles/colors";
import CircleValue from "../CircleValue";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../Button";
import NavigationService from "../../navigator/NavigationService";
import { StackActions } from "react-navigation";
import BlockedBadge from "../Item/BlockedBadge";
import Shadows from "../Shadows";

export default class SaleCard extends Component {
  render() {
    const { data } = this.props;
    //console.log(data);
    return (
      <View
        style={{
          width: itemWidth,
          paddingHorizontal: itemHorizontalMargin,
          paddingVertical: 10
        }}
      >
        <Button
          style={{
            ...Shadows[4],
            padding: 4,
            backgroundColor: colors.white,
            borderRadius: 6,
            flexDirection: "row"
          }}
          onPress={this.goItem}
        >
          <View style={{ flex: 1 / 4 }}>
            <Image
              style={{ flex: 1, borderRadius: 6 }}
              source={{ uri: data.image_ad[0] }}
              resizeMode={"cover"}
            />
          </View>
          <View style={{ flex: 3 / 4, paddingHorizontal: 5 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Header2 color={"primary"} numberOfLines={1} style={{ flex: 1 }}>
                {data.book.title}
              </Header2>

              <Icon
                name="chevron-right"
                size={20}
                style={{ color: colors.black }}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Header5 numberOfLines={1}>di {data.book.author}</Header5>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Header2 color="primary" style={{}}>
                    EUR {data.price}
                  </Header2>
                </View>
              </View>
              <CircleValue value={data.condition} radius={35} />
            </View>
          </View>
          {data.enabled === false && <BlockedBadge />}
        </Button>
      </View>
    );
  }

  goItem = () => {
    const pushAction = StackActions.push({
      routeName: "Item",
      params: {
        itemID: this.props.data._id,
        name: this.props.data.book.title,
        authors: this.props.data.book.author
      }
    });
    NavigationService.dispatch(pushAction);
  };
}
