import { Platform, Dimensions } from "react-native";

const DEVICE_SCALE = Dimensions.get("window").width / 411;

const PRIMARY = "helvetica";
const SECONDARY = Platform.OS === "android" ? "basis" : "helvetica";

function normalize(size) {
  return Math.round(DEVICE_SCALE * size);
}

export default {
  PRIMARY,
  SECONDARY,
  normalize
};
