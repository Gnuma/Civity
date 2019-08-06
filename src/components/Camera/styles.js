import { StyleSheet, Dimensions, StatusBar } from "react-native";
import colors from "../../styles/colors";

const sideContainer = 50;
const numPreviews = 5;
const previewRatio = 4 / 4;
const itemMargin = 5;
const borderWidth = 2;

const screenWidth = Dimensions.get("screen").width;
const middleContainer = screenWidth - sideContainer * 2 - 2;
const itemBoxWidth =
  middleContainer / numPreviews - itemMargin * 2 - borderWidth * 2;
const containerHeight = (itemBoxWidth + borderWidth * 2) * previewRatio;
const itemHeight = itemBoxWidth * previewRatio;
console.log(itemBoxWidth, containerHeight);

export const cameraPreview = StyleSheet.create({
  container: {
    flex: 1,
    height: containerHeight,
    alignItems: "center",
    justifyContent: "center"
  },
  itemContainer: {
    borderRadius: 4,
    marginHorizontal: itemMargin,
    elevation: 4,
    borderColor: "white",
    borderWidth: borderWidth
  },
  imagePreview: {
    height: itemHeight,
    width: itemBoxWidth,
    justifyContent: "center",
    alignItems: "center"
  },
  deletePreviewBtn: {
    right: 3,
    top: 2,
    position: "absolute"
  },
  unknownPreview: {
    height: itemHeight + borderWidth * 2,
    width: itemBoxWidth + borderWidth * 2,
    borderWidth: borderWidth,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: itemMargin,
    borderRadius: 4
  }
});

export const bottomBar = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 35,
    zIndex: 1
  },
  leftBox: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center"
  },
  middleBox: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row"
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white"
  },
  rightBox: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  }
});

export const generalStyle = StyleSheet.create({
  p10: {
    padding: 10
  },
  w: {
    color: "white"
  }
});

export const header = StyleSheet.create({
  container: {
    height: containerHeight,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10 + (StatusBar.currentHeight || 0),
    marginBottom: 10,
    zIndex: 1
  }
});
