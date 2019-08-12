import React, { Component } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  PanResponder
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import BookTemplate from "./BookTemplate";
import { sliderWidth, wp, itemHorizontalMargin } from "./styles";
import colors from "../../styles/colors";
import { NCHeight } from "./MainHome";
import BookShelfPagination from "./BookShelfPagination";
import { ___BOOK_IMG_RATIO___ } from "../../utils/constants";
import { Header3, Header2 } from "../Text";

export default class BookShelf extends Component {
  state = {
    width: Dimensions.get("window").width,
    activeSlide: 0
  };

  itemWidth = null;
  itemHeight = null;

  _renderItem = ({ item, index }, parallaxProps) => {
    return (
      <BookTemplate
        data={item}
        parallaxProps={parallaxProps}
        onPress={this.props.onPress}
        itemWidth={this.itemWidth}
        itemHeight={this.itemHeight}
      />
    );
  };

  render() {
    const { activeSlide } = this.state;
    const { containerLayout } = this.props;
    if (!containerLayout) return null;
    const vh = containerLayout.height - NCHeight - PaginationHeight;
    this.itemWidth = wp(60);
    this.itemHeight = wp(60) * ___BOOK_IMG_RATIO___ + LabelHeight;
    if (this.itemHeight > vh) {
      this.itemHeight = vh;
      this.itemWidth = (this.itemHeight - LabelHeight) / ___BOOK_IMG_RATIO___;
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View>
            <Carousel
              data={data}
              renderItem={this._renderItem}
              sliderWidth={sliderWidth}
              itemWidth={this.itemWidth}
              hasParallaxImages={true}
              inactiveSlideScale={0.82}
              inactiveSlideOpacity={0.8}
              onSnapToItem={index => this.setState({ activeSlide: index })}
              enableMomentum={true}
            />
          </View>
        </View>
        <View
          style={{
            height: PaginationHeight,
            justifyContent: "center"
          }}
        >
          <BookShelfPagination data={data} focus={activeSlide} />
        </View>
      </View>
    );
  }
}

const PaginationHeight = 40;
export const LabelHeight = 60;

const data = [
  {
    title: "Matematica blu 1",
    subject: "Matematica",
    img: require("../../media/imgs/MatematicaBlu.jpg"),
    isbn: 978880822085,
    author: "Massimo Bergamini, Graziella Barozzi, Anna Trifone"
  },
  {
    title: "Il piacere dei testi 3",
    subject: "Letteratura",
    img: require("../../media/imgs/IlPiacereDeiTesti.jpg"),
    isbn: 978883953224,
    author: "Guido Baldi, Silvia Giusso, Mario Razetti"
  },
  {
    title: "Performer heritage 1",
    subject: "Inglese",
    img: require("../../media/imgs/PerformerHeritage.jpg"),
    isbn: 978880873744,
    author: "Marina Spiazzi, Marina Tavella, Margaret Layton"
  },
  {
    title: "La parola alla storia 2",
    subject: "Storia",
    img: require("../../media/imgs/LaParolaAllaStoria.jpg"),
    isbn: 978889152023,
    author: "Barbara Biggio"
  }
];
