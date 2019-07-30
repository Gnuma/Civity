import React, { Component } from "react";
import { Text, StyleSheet, View, Animated, Dimensions } from "react-native";
import {
  PanGestureHandler,
  State,
  ScrollView
} from "react-native-gesture-handler";
import colors from "../styles/colors";
import { Header3, Header1 } from "./Text";
import NativeButton from "./NativeButton";
import Button from "./Button";
import FullButton from "./FullButton";
import Icon from "react-native-vector-icons/FontAwesome";
import Divider from "./Divider";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

export default class SpringHeader extends Component {
  constructor(props) {
    super(props);

    this.minHeight = props.minHeight;
    this.maxHeight = viewportHeight;
    this.deltaY = this.maxHeight - this.minHeight;
  }

  scrollY = new Animated.Value(0);
  lastScrollY = 0;

  onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: this.scrollY } }],
    { useNativeDriver: true }
  );

  onHandlerStateChange = event => {
    console.log(event.nativeEvent);
    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED
    ) {
      this.scrollY.flattenOffset();
      const { velocityY, translationY } = event.nativeEvent;
      let toValue;
      if (
        (velocityY < 1000 && translationY < this.deltaY / 2) ||
        velocityY < -1000
      ) {
        toValue = 0;
      } else {
        toValue = this.deltaY;
      }
      Animated.spring(this.scrollY, {
        toValue: toValue,
        velocity: velocityY,
        friction: 10,
        useNativeDriver: true
      }).start();
    } else if (event.nativeEvent.state === State.BEGAN) {
      this.scrollY.extractOffset();
      this.scrollY.stopAnimation();
    }
  };

  renderHeader = () => {
    return (
      <View style={[{ height: this.minHeight }, styles.container]}>
        <Button style={styles.goBackBtn}>
          <Icon name={"chevron-left"} size={24} style={styles.backIcon} />
        </Button>
        <View>
          <Header1 color={"primary"}>{"Titolo"}</Header1>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0
        }}
      >
        <PanGestureHandler
          onHandlerStateChange={this.onHandlerStateChange}
          onGestureEvent={this.onPanGestureEvent}
        >
          <Animated.View
            style={{
              backgroundColor: colors.white,
              height: this.maxHeight,
              transform: [
                {
                  translateY: this.scrollY.interpolate({
                    inputRange: [0, this.deltaY],
                    outputRange: [-this.deltaY, 0],
                    extrapolate: "clamp"
                  })
                }
              ],
              elevation: 4,
              justifyContent: "flex-end"
            }}
          >
            <Divider />
            {this.renderHeader()}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white"
  },
  goBackBtn: {
    padding: 10,
    borderRadius: 4
  },
  backIcon: {
    color: colors.black
  }
});
