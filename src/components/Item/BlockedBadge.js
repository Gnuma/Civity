import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../styles/colors";
import { Header4 } from "../Text";

export default class BlockedBadge extends Component {
  render() {
    const { rotation } = this.props;
    return (
      <View style={styles.view}>
        <Header4
          style={[
            styles.text,
            rotation
              ? { transform: [{ rotateZ: rotation }] }
              : { transform: [{ rotateZ: "-45deg" }] }
          ]}
        >
          Eliminato
        </Header4>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    ...StyleSheet.absoluteFill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    flex: 1,
    color: colors.white,
    textAlign: "center",
    backgroundColor: colors.darkRed,
    paddingVertical: 2
  }
});

/**transform: [
      {
        rotateZ: "-45deg"
      }
    ] */
