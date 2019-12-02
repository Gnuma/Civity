import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import colors from "../styles/colors";

interface BottomSheetProps {
  isOpen?: boolean;
}

class BottomSheet extends Component<BottomSheetProps> {
  render() {
    const { children } = this.props;

    return (
      <View style={styles.fullContainer}>
        <View style={[styles.container]}>
          <View style={styles.innerContainer}>
            <View style={styles.notch} />
            {children}
          </View>
        </View>
      </View>
    );
  }
}

export default BottomSheet;

const styles = StyleSheet.create({
  fullContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black + "50",
    elevation: 3
  },
  container: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row"
  },
  innerContainer: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 20
  },
  notch: {
    marginTop: 15,
    marginBottom: 5,
    alignSelf: "center",
    width: 50,
    height: 6,
    borderRadius: 4,
    backgroundColor: colors.grey
  }
});
