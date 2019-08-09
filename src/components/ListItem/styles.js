import { StyleSheet } from "react-native";
import colors from "../../styles/colors";
import Shadows from "../Shadows";

const itemHeight = 130;
const imageWidth = 122;

export default StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    height: itemHeight,
    borderRadius: 10,

    backgroundColor: "white",

    ...Shadows[5],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  image: {
    height: itemHeight,
    width: imageWidth,
    borderBottomLeftRadius: 10
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
    margin: 10,
    ...Shadows[3],
    borderRadius: 10,
    backgroundColor: "white"
  },
  multiHeader: {
    flex: 1,
    flexGrow: 1,
    paddingLeft: 5,
    paddingBottom: 5,
    borderTopEndRadius: 10,
    backgroundColor: "white"
  }
});
