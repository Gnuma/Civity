import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import colors from "../styles/colors";
import { Header5 } from "./Text";
import { Svg, Circle, Path } from "react-native-svg";
import { LEVEL_DATA, CONDITIONS_DATA } from "../utils/constants";
const STROKE_RATIO = 0.1;

class CircleValue extends Component {
  static propTypes = {
    radius: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    experience: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    style: PropTypes.any,
    inactive: PropTypes.bool,
    //ToDO
    fontSize: PropTypes.number
  };

  static CircleValueType = {
    LEVEL: "LEVEL",
    STATUS: "STATUS",
    USERNAME: "USERNAME"
  };

  render() {
    const {
      radius,
      type,
      value,
      style,
      experience,
      fontSize,
      inactive
    } = this.props;
    //const stroke = radius * STROKE_RATIO;
    const stroke = 5;
    const size = radius * 2;
    const circleRadius = radius - stroke;
    const { text, percentage, color } =
      type == "STATUS" ? getConditions(value) : getLevel(value, experience);
    const calculatedFontSize =
      fontSize ||
      circleRadius *
        (type == "STATUS" ? FONT_CONDITION_RATIO : FONT_LEVEL_RATIO);
    const d = describeArc(radius, radius, circleRadius, 0, percentage);
    const textColor =
      (inactive && colors.lightGrey) ||
      (type == "STATUS" && "primary") ||
      "secondary";

    return (
      <View style={[{ width: size, height: size }, style]}>
        <Svg height={size} width={size}>
          <Circle
            cx={radius}
            cy={radius}
            r={circleRadius}
            fillOpacity={0}
            strokeWidth={stroke}
            stroke={colors.lightGrey}
          />
          <Path d={d} stroke={color} strokeWidth={stroke} fill="none" />
        </Svg>
        <View
          style={{
            ...StyleSheet.absoluteFill,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Header5
            color={textColor}
            style={{
              fontSize: calculatedFontSize
            }}
          >
            {text}
          </Header5>
        </View>
      </View>
    );
  }
}

CircleValue.defaultProps = {
  radius: 50,
  type: CircleValue.CircleValueType.STATUS,
  color: colors.secondary
};

export default CircleValue;

const getConditions = id => {
  switch (id) {
    case 0:
      return CONDITIONS_DATA[0];
    case 1:
      return CONDITIONS_DATA[1];
    case 2:
      return CONDITIONS_DATA[2];
    default:
      return CONDITIONS_DATA[3];
  }
};

const getLevel = (value = 0, experience = 0) => {
  experience = (experience == "FULL" && LEVEL_DATA[value]) || experience;
  console.log(experience / LEVEL_DATA[value]);
  return {
    text: value,
    percentage: (experience / LEVEL_DATA[value]) * 359.99,
    color: colors.secondary
  };
};

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y
  ].join(" ");

  return d;
}

const FONT_CONDITION_RATIO = 0.4;
const FONT_LEVEL_RATIO = 0.7;
