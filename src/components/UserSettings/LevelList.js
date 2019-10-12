import React, { Component } from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import Carousel from "react-native-snap-carousel";
import { LEVEL_DATA, CircleValueType } from "../../utils/constants";
import { sliderWidth, itemWidth } from "./styles";
import CircleValue from "../CircleValue";

class LevelList extends Component {
  static propTypes = {
    level: PropTypes.number,
    exp: PropTypes.number
  };

  renderItem = ({ item, index }) => {
    const { level, exp } = this.props;
    let experience;
    if (item < level) {
      experience = "FULL";
    } else if (item == level) {
      experience = exp;
    }
    console.log(level, experience, item);
    return (
      <CircleValue
        value={item}
        radius={itemWidth / 2}
        type={CircleValueType.LEVEL}
        inactive={!experience}
        experience={experience}
      />
    );
  };

  render() {
    const data = Object.keys(LEVEL_DATA);
    return (
      <View>
        <Carousel
          data={data}
          renderItem={this.renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={0.7}
          inactiveSlideOpacity={0.6}
          firstItem={this.props.level - 1}
          enableMomentum
        />
      </View>
    );
  }
}

LevelList.defaultProps = {
  level: 2,
  exp: 170
};

export default LevelList;
