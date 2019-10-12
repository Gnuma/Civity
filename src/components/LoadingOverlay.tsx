import React, { Component } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle
} from "react-native";
import colors from "../styles/colors";
//import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface LoadingOverlayProps {
  style?: StyleProp<ViewStyle>;
  opacity?: number;
}

export default class LoadingOverlay extends Component<LoadingOverlayProps> {
  render() {
    const { style, opacity = 0.2 } = this.props;
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 10 }}>
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
