import { StyleSheet, Dimensions } from "react-native";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

function wpWidth(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

function wpHeight(percentage) {
  const value = (percentage * viewportHeight) / 100;
  return Math.round(value);
}

export const inputBarHeight = 60;
