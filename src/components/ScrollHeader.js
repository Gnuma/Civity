import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Platform,
  Keyboard
} from "react-native";
import {
  PanGestureHandler,
  State,
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native-gesture-handler";
import colors from "../styles/colors";
import { Header3, Header1 } from "./Text";
import NativeButton from "./NativeButton";
import Button from "./Button";
import FullButton from "./FullButton";
import Icon from "react-native-vector-icons/FontAwesome";
import Divider from "./Divider";
import { STATUS_BAR_MARGIN } from "../utils/constants";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

THRESHOLD_VELOCITY = 500;

export default class ScrollHeader extends Component {
  constructor(props) {
    super(props);

    this.minHeight = props.minHeight;
    this.maxHeight = viewportHeight - STATUS_BAR_MARGIN;
    this.deltaY = this.maxHeight - this.minHeight;

    this.state = {
      status: HEADER_STATUS.CLOSED,
      contentHeight: viewportHeight,
      initialized: false,
      pointerEvent: "box-none"
    };
  }

  scrollY = new Animated.Value(0);
  lastScrollY = 0;

  onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: this.scrollY } }],
    { useNativeDriver: true }
  );

  onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.setPointerEvent("auto");

      const { velocityY: v, translationY } = event.nativeEvent;
      let { height: windowHeight } = Dimensions.get("window");
      windowHeight -= STATUS_BAR_MARGIN;

      if (this.state.status === HEADER_STATUS.CLOSED) {
        if (
          (translationY < windowHeight / 2 && v < THRESHOLD_VELOCITY) ||
          (translationY >= windowHeight / 2 && v < -THRESHOLD_VELOCITY)
        ) {
          this.scrollTo(0, HEADER_STATUS.CLOSED, v);
        } else {
          this.scrollTo(
            windowHeight - this.minHeight,
            HEADER_STATUS.PENDING,
            v
          );
        }
      } else if (this.state.status === HEADER_STATUS.PENDING) {
        if (translationY <= 0 && v <= -THRESHOLD_VELOCITY) {
          this.scrollTo(
            -(windowHeight - this.minHeight),
            HEADER_STATUS.CLOSED,
            v
          );
        } else if (
          translationY <= 0 ||
          this.lastScrollY == this.state.contentHeight
        ) {
          this.scrollTo(0, HEADER_STATUS.PENDING, v);
        } else {
          this.lastScrollY += translationY;
          this.lastScrollY = Math.min(
            this.lastScrollY,
            this.state.contentHeight
          );
          this.scrollY.setOffset(this.lastScrollY);
          this.scrollY.setValue(0);
          setTimeout(() => {
            this.setState({
              status: HEADER_STATUS.OPEN
            });
          }, 0);
        }
      } else if (this.state.status === HEADER_STATUS.OPEN) {
        this.lastScrollY += translationY;
        this.lastScrollY = Math.min(
          this.state.contentHeight,
          Math.max(windowHeight - this.minHeight, this.lastScrollY)
        );
        this.scrollY.setOffset(this.lastScrollY);
        this.scrollY.setValue(0);
        if (this.lastScrollY === windowHeight - this.minHeight) {
          setTimeout(() => {
            this.setState({
              status: HEADER_STATUS.PENDING
            });
          }, 0);
        }
      }
    } else if (event.nativeEvent.state === State.BEGAN) {
      this.scrollY.stopAnimation();
    } else if (event.nativeEvent.state === State.ACTIVE) {
      Keyboard.dismiss();
    }
  };

  getConstraints = status => {
    let minScroll, maxScroll;
    let { height: windowHeight } = Dimensions.get("window");
    windowHeight -= STATUS_BAR_MARGIN;

    switch (status) {
      case HEADER_STATUS.CLOSED:
        minScroll = 0;
        maxScroll = windowHeight - this.minHeight;
        break;

      case HEADER_STATUS.PENDING:
        minScroll = 0;
        maxScroll = this.state.contentHeight;
        break;

      case HEADER_STATUS.OPEN:
        minScroll = windowHeight - this.minHeight;
        maxScroll = this.state.contentHeight;
    }
    return { minScroll, maxScroll };
  };

  scrollTo = (toValue, status, velocity) => {
    status === HEADER_STATUS.CLOSED && this.setPointerEvent("box-none");
    Animated.spring(this.scrollY, {
      toValue,
      tension: 15,
      useNativeDriver: true
    }).start(() => this.updateStatus(toValue, status));
  };

  updateStatus = (toValue, status) => {
    this.lastScrollY += toValue;
    this.scrollY.setOffset(this.lastScrollY);
    this.scrollY.setValue(0);
    setTimeout(() => {
      this.setState({
        status
      });
    }, 0);
  };

  render() {
    const { status, contentHeight, initialized, pointerEvent } = this.state;
    let { height: windowHeight } = Dimensions.get("window");
    windowHeight -= STATUS_BAR_MARGIN;

    const { minScroll, maxScroll } = this.getConstraints(status);

    return (
      <View
        style={{
          ...StyleSheet.absoluteFill,
          elevation: 10,
          zIndex: 10
        }}
        pointerEvents={pointerEvent}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: colors.black,
            opacity: this.scrollY.interpolate({
              inputRange: [minScroll, maxScroll],
              outputRange: [0, 1]
            })
          }}
          pointerEvents="none"
        />
        <View
          style={{
            position: "absolute",
            top: initialized ? -contentHeight : undefined,
            bottom: initialized ? undefined : windowHeight - this.minHeight,
            right: 0,
            left: 0,
            elevation: 10,
            zIndex: 10
          }}
        >
          <PanGestureHandler
            onHandlerStateChange={this.onHandlerStateChange}
            onGestureEvent={this.onPanGestureEvent}
          >
            <Animated.View
              style={{
                backgroundColor: colors.white,
                minHeight: windowHeight,
                transform: [
                  {
                    translateY: this.scrollY.interpolate({
                      inputRange: [minScroll, maxScroll],
                      outputRange: [minScroll, maxScroll],
                      extrapolate: "clamp"
                    })
                  }
                ],
                elevation: 4
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end"
                }}
              >
                <View onLayout={this.onContentLayout}>
                  {this.props.renderContent()}
                </View>
                <Divider />
                {this.props.renderHeader()}
              </View>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    );
  }

  onContentLayout = event => {
    const { height: windowHeight } = Dimensions.get("window");
    this.setState({
      initialized: true,
      contentHeight: Math.max(
        event.nativeEvent.layout.height,
        windowHeight - this.minHeight - STATUS_BAR_MARGIN
      )
    });
  };

  setPointerEvent = pointerEvent => {
    this.setState({
      pointerEvent
    });
  };
}

const HEADER_STATUS = {
  CLOSED: "CLOSED",
  PENDING: "PENDING",
  OPEN: "OPEN"
};
