import React, { Component } from "react";
import { View, Platform, StyleSheet, Dimensions, Ima } from "react-native";
import { ParallaxImage } from "react-native-snap-carousel";
import { itemHorizontalMargin } from "./styles";
import { Header1, Header2 } from "../Text";
import colors from "../../styles/colors";
import Button from "../Button";
import { LabelHeight } from "./BookShelf";
import Shadows from "../Shadows";

const IS_IOS = Platform.OS === "ios";

export default class BookTemplate extends Component {
  get image() {
    const {
      data: { img },
      parallaxProps
    } = this.props;
    return (
      <ParallaxImage
        source={img}
        containerStyle={{
          flex: 1,
          backgroundColor: "white"
        }}
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 6,
          resizeMode: "cover"
        }}
        parallaxFactor={0.1}
        showSpinner={true}
        spinnerColor={"rgba(255, 255, 255, 0.4)"}
        {...parallaxProps}
      />
    );
  }

  render() {
    const {
      data: { title, subject },
      itemWidth,
      itemHeight
    } = this.props;
    return (
      <View
        style={{
          width: itemWidth,
          height: itemHeight,
          padding: 5
        }}
      >
        <Button
          style={{
            flex: 1,
            backgroundColor: "white",
            ...Shadows[4],
            borderRadius: 6
          }}
          onPress={this._onBookPick}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "white"
            }}
          >
            {this.image}
          </View>
        </Button>
        <View
          style={{
            justifyContent: "center",
            height: LabelHeight,
            marginTop: 10
          }}
        >
          <Header1
            color={"primary"}
            numberOfLines={1}
            style={{
              fontSize: Math.max(
                10,
                Math.min(27, (itemWidth / title.length) * 2)
              )
            }}
          >
            {title}
          </Header1>
          <Header2>{subject}</Header2>
        </View>
      </View>
    );
  }

  _onBookPick = () => {
    this.props.onPress({
      isbn: this.props.data.isbn,
      title: this.props.data.title,
      author: this.props.data.author
    });
  };
}
