import React, { Component } from "react";
import { View, Image, Dimensions, StyleSheet, Platform } from "react-native";
import PropTypes from "prop-types";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import {
  sliderWidth,
  itemWidth,
  slideHeight,
  itemHorizontalMargin
} from "./styles_Deprecated";
import colors from "../../styles/colors";
import Shadows from "../Shadows";

const IS_IOS = Platform.OS === "ios";

export class ImageSlider_Deprecated extends Component {
  _renderItem = ({ item, index }, parallaxProps) => {
    const uri = typeof item === "string" ? item : item.uri || item.base64;

    return (
      <View
        style={{
          width: itemWidth,
          height: slideHeight,
          paddingHorizontal: itemHorizontalMargin
        }}
      >
        <ParallaxImage
          source={/*mockData[0]*/ { uri }}
          containerStyle={{
            flex: 1,
            marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
            backgroundColor: colors.white,
            borderRadius: 8
          }}
          style={{
            ...StyleSheet.absoluteFillObject,
            resizeMode: "cover",
            borderRadius: 8
          }}
          parallaxFactor={0.1}
          showSpinner={true}
          spinnerColor={"rgba(255, 255, 255, 0.4)"}
          {...parallaxProps}
        />
      </View>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <View style={[this.props.style]}>
        <Carousel
          ref={c => (this.slider = c)}
          data={data /*mockData*/}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          //sliderHeight={height + 10}
          hasParallaxImages={true}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
        />
      </View>
    );
  }
}

export default ImageSlider_Deprecated;

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 8,
    backgroundColor: "white",
    margin: 10,
    ...Shadows[4]
  }
});

/*

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={{
              width: this.state.width - imgMargin,
              height: this.state.height
            }}
            source={require("../../media/imgs/matematicaVerde.jpeg")}
          />
        </View>
      </View>
    );
  };
*/

const mockData = [
  require("../../media/imgs/matematicaVerde.jpeg"),
  require("../../media/imgs/CorsaroNero.jpeg"),
  require("../../media/imgs/sezioneAurea.jpeg"),
  require("../../media/imgs/GuerraMondiale.jpeg"),
  require("../../media/imgs/mockHomeBook.png")
];
