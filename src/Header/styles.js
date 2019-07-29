import { StyleSheet } from "react-native";
import colors from "../styles/colors";

export default StyleSheet.create({
  logo: {
    fontWeight: "300",
    letterSpacing: 4
  },

  header: {
    flexDirection: "row",
    height: 60,
    backgroundColor: colors.secondary,
    paddingVertical: 3,
    paddingRight: 10
  },
  icon: {
    color: "white"
  },
  p5: {
    padding: 5
  },
  rightHeaderContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexGrow: 1
  },
  searchBoxContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 6,
    overflow: "hidden"
  },
  searchInput: {
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flex: 1
  },
  resetIcon: {
    color: colors.primary
  },
  searchIcon: {
    color: colors.primary,
    paddingRight: 8
  },
  goBack: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    borderRadius: 40
  },

  //NEW
  headerContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  logoContainer: {
    paddingLeft: 10,
    flex: 1
  }
});
