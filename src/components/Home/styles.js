import { Dimensions } from "react-native";
import { ___BOOK_IMG_RATIO___ } from "../../utils/constants";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

export function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export const slideWidth = wp(60);
export const slideHeight = slideWidth * ___BOOK_IMG_RATIO___ + 40;
export const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
