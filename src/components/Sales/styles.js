import { StyleSheet, Dimensions } from "react-native";
const imgRatio = 4 / 3;

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export const slideWidth = wp(90);
export const itemHorizontalMargin = wp(3);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
export const imgHeight = (itemWidth * (4 / 3)) / 3;
