import { Dimensions, StyleSheet } from "react-native";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export const slideWidth = wp(25);
export const itemHorizontalMargin = 0;

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default StyleSheet.create({
  actionButton: {
    marginHorizontal: 0,
    paddingVertical: 6,
    marginVertical: 6
  },
  actionText: {
    textAlign: "center",
    flex: 1
  }
});
