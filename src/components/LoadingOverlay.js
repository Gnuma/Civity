import React, { Component } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import colors from "../styles/colors";
//import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class LoadingOverlay extends Component {
  render() {
    const { style, opacity = 0.2 } = this.props;
    return (
      <View style={{ ...StyleSheet.absoluteFill, zIndex: 100 }}>
        <TouchableWithoutFeedback
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center"
            }}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                { opacity, backgroundColor: colors.black },
                style
              ]}
            />
            <ActivityIndicator style={styles.indicator} size="large" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    alignSelf: "center",
    zIndex: 1
  }
});

/*

        <View
          style={[
            StyleSheet.absoluteFill,
            { opacity, backgroundColor: colors.black },
            style
          ]}
        />
        */
