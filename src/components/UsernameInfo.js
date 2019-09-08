import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../styles/colors";
import { Header5, Header4 } from "./Text";
import { Svg, Circle, Path } from "react-native-svg";
import { LEVEL_DATA } from "../utils/constants";
import { getLevel } from "../utils/helper";

export default ({ style, size, userInfo = {}, hideLevel, hideFeedback }) => {
  const { respect, xp } = userInfo;
  const level = getLevel(xp).level;
  const radius = size / 2;
  const stroke = radius * 0.15;
  const circleRadius = radius - stroke;
  const angle = Math.max(0, Math.min(360 * (respect / 100), 359.99));
  const d = describeArc(radius, radius, circleRadius, 0, angle);

  return (
    <View style={[{ width: size, height: size }, style]}>
      {!hideFeedback && (
        <Svg height={size} width={size}>
          <Circle
            cx={radius}
            cy={radius}
            r={circleRadius}
            fillOpacity={0}
            strokeWidth={stroke}
            stroke={colors.lightGrey}
          />
          <Path
            d={d}
            stroke={colors.secondary}
            strokeWidth={stroke}
            fill="none"
          />
        </Svg>
      )}
      {!hideLevel && (
        <View style={styles.levelContainer}>
          <Header4 style={[styles.levelText, { fontSize: size * 0.5 }]}>
            {level}
          </Header4>
        </View>
      )}
    </View>
  );
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

const styles = StyleSheet.create({
  levelContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center"
  },
  levelText: {
    color: colors.secondary,
    fontWeight: "bold"
  }
});
