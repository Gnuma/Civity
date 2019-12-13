import { StyleSheet } from "react-native";
import Shadows from "../Shadows";
import colors from "../../styles/colors";

export const CHAT_SMALL_ITEM_WIDTH = 240;
export const CHAT_SMALL_ITEM_HEIGHT = 100;

export default StyleSheet.create({
  fullScreen: {
    width: 100,
    height: 100,
    backgroundColor: "red"
  },
  container: {
    minWidth: 100,
    maxWidth: 300,
    marginHorizontal: 10,
    marginTop: 5,
    borderRadius: 10,
    ...Shadows[1]
  },
  left: {
    alignSelf: "flex-start",
    backgroundColor: colors.white
  },
  right: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary
  },
  pressed: {
    backgroundColor: "#D1FCFF"
  },
  content: {
    fontSize: 15,
    paddingBottom: 4
  },
  newMessageLeft: {
    marginTop: 15,
    borderTopLeftRadius: 0
  },
  newMessageRight: {
    marginTop: 15,
    borderTopRightRadius: 0
  },
  link: {
    color: "#0645AD",
    textDecorationLine: "underline"
  },
  image: {
    width: 300 - 8 * 2,
    height: 300 - 8 * 2,
    borderRadius: 4
  },
  textRight: {
    color: colors.white
  },
  textLeft: {
    color: colors.black
  },
  contentContainer: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 10
  },
  footerContainer: {
    height: 14,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },

  systemMessage: {
    textAlign: "center",
    fontSize: 13,
    color: "#303030",
    alignSelf: "center",
    marginVertical: 5
  },

  itemModificationContainer: {
    marginTop: 15,
    flexDirection: "row"
  },
  itemModificationBubbleContainer: {
    maxWidth: CHAT_SMALL_ITEM_WIDTH,
    marginHorizontal: 0,
    marginTop: 0
  },
  itemRightContainer: {
    backgroundColor: colors.primary
  },
  itemLeftContainer: {
    backgroundColor: colors.white
  },
  itemSideContainer: {
    flex: 1 / 2,
    height: CHAT_SMALL_ITEM_HEIGHT,
    justifyContent: "center"
  },
  itemSideGreenConnector: {
    height: 5,
    backgroundColor: colors.secondary
  },
  itemSideAdd: {
    backgroundColor: colors.secondary,
    height: 20,
    width: 20,
    borderRadius: 10
  },
  itemSideCircleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center"
  }
});
