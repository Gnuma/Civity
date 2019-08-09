import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import Button from "../Button";
import { Header3 } from "../Text";
import Carousel from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "./styles";
import SaleCard from "./SaleCard";
import colors from "../../styles/colors";
import SalePagination from "./SalePagination";
import Shadows from "../Shadows";

export class SalesTab extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    goTo: PropTypes.func,
    data: PropTypes.object,
    orderedData: PropTypes.array,
    focus: PropTypes.number
  };

  onSwipe = index => {
    //const focus = this.props.orderedData[index].itemID;
    this.props.goTo(index);
  };

  _renderItem = ({ item, index }, parallaxProps) => {
    return (
      <SaleCard
        data={this.props.data[item.itemID]}
        parallaxProps={parallaxProps}
      />
    );
  };

  render() {
    const { orderedData, focus, data } = this.props;

    return (
      <View
        style={{
          backgroundColor: colors.white,
          //borderBottomLeftRadius: 6,
          //borderBottomRightRadius: 6,
          ...Shadows[2],
          paddingVertical: 5
        }}
      >
        <Carousel
          ref={t => {
            this.tab = t;
          }}
          data={orderedData}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          onSnapToItem={this.onSwipe}
        />
        <SalePagination data={orderedData} focus={focus} fullData={data} />
      </View>
    );
  }
}

export default SalesTab;
