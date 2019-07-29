import { StyleSheet, Dimensions } from "react-native";
import colors from "../../styles/colors";
import { ___BOOK_IMG_RATIO___ } from "../../utils/constants";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

//const width = viewportWidth - 35 * 2;

export const slideWidth = wp(85);
export const slideHeight = Math.min(
  slideWidth * ___BOOK_IMG_RATIO___,
  Math.round(viewportHeight / 1.8)
);
export const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export const MainItemStyles = StyleSheet.create({
  scrollView: {
    paddingBottom: 35
  },
  imageSlider: {
    marginVertical: 10
  },
  content: {
    flex: 1,
    marginHorizontal: 35,
    paddingBottom: 80
  },
  bigDivider: {
    marginBottom: 10
  },
  smallDivider: {
    marginTop: 10,
    marginBottom: 10
  }
});

export const HeaderStyles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 6
  },
  goBack: {
    padding: 10
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "row"
  },
  content: {
    flex: 1,
    justifyContent: "center"
  },
  authors: {
    marginLeft: 10
  },
  notificationButton: {
    padding: 10,
    marginHorizontal: 5,
    alignSelf: "center",
    borderRadius: 6
  }
});

export const ItemInfoStyles = StyleSheet.create({
  row: {
    flexDirection: "row"
  },
  rightAlign: {
    flex: 1,
    alignItems: "flex-end"
  },
  conditionOfficeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15
  },
  descriptionContainer: {
    alignItems: "center"
  },
  textCenterAlign: {
    textAlign: "center"
  },
  secondaryInfoContainer: {
    flexDirection: "row"
  }
});

export const SellerInfoStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    elevation: 3,
    padding: 10,
    borderRadius: 6,
    marginBottom: 8
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  exploreIconContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  buttonListContainer: {
    marginVertical: 10
  },
  button: {
    backgroundColor: "white",
    elevation: 2,
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 4
  },
  buttonIcon: {
    position: "absolute",
    right: 10,
    alignSelf: "center"
  }
});
