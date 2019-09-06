import { StyleSheet, Dimensions } from "react-native";
import colors from "../../styles/colors";
import Shadows from "../Shadows";

const itemHeight = 130;
const imageWidth = 122;

export default StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    height: itemHeight,
    borderRadius: 5,

    backgroundColor: "white",

    ...Shadows[4],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden"
  },
  image: {
    height: itemHeight,
    width: imageWidth,
    borderBottomLeftRadius: 5
  },
  itemContent: {
    flex: 1,
    marginLeft: 5
  },
  itemTopContent: {
    flex: 2,
    flexDirection: "row"
  },
  leftColTopContent: {
    flex: 3
  },
  itemBottomContent: {
    flex: 1
  },
  m10: {
    margin: 10
  },
  ml15: {
    marginLeft: 15
  },
  itemButton: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    ...Shadows[2],
    borderRadius: 5,
    backgroundColor: "white"
  },
  multiHeader: {
    flex: 1,
    flexGrow: 1,
    paddingLeft: 5,
    paddingBottom: 5,
    borderTopEndRadius: 5,
    backgroundColor: "white"
  }
});

export const ITEM_BORDER_RADIUS = 5;
export const IS_SMALL_DEVICE = Dimensions.get("window").width < 350;
