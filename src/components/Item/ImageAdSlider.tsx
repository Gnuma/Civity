import React, { Component } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle
} from "react-native";
import PropTypes from "prop-types";
import Carousel, {
  ParallaxImage,
  AdditionalParallaxProps
} from "react-native-snap-carousel";
import colors from "../../styles/colors";
import Shadows from "../Shadows";
import { SellImage } from "../../store/sell/types";
import { imageAdMargin, imageAdToWidthRatio } from "./styles";

interface ImageAdSliderProps {
  image_ad: SellImage[];
  style?: StyleProp<ViewStyle>;
}

const IS_IOS = Platform.OS === "ios";

const ImageAdSlider = ({ image_ad, style }: ImageAdSliderProps) => {
  const vw = Dimensions.get("window").width;
  const imageSize = vw * imageAdToWidthRatio;

  const renderImage = (
    { item }: { item: SellImage },
    parallaxProps: AdditionalParallaxProps
  ) => {
    return (
      <View
        style={{
          width: imageSize,
          height: imageSize,
          padding: imageAdMargin
        }}
      >
        <ParallaxImage
          source={{ uri: item.uri }}
          containerStyle={{
            flex: 1,
            marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
            backgroundColor: colors.white,
            borderRadius: 8,
            ...Shadows[1]
          }}
          style={{
            ...StyleSheet.absoluteFillObject,
            resizeMode: "cover"
          }}
          parallaxFactor={0.1}
          {...parallaxProps}
        />
      </View>
    );
  };

  return (
    <Carousel
      data={image_ad}
      renderItem={renderImage}
      sliderWidth={vw}
      itemWidth={imageSize}
      hasParallaxImages={true}
      inactiveSlideScale={1}
      inactiveSlideOpacity={1}
      enableMomentum={true}
      containerCustomStyle={style}
    />
  );
};

export default ImageAdSlider;
