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
import { PanGestureHandler, State } from "react-native-gesture-handler";
import colors from "../styles/colors";
import Divider from "./Divider";
import { STATUS_BAR_MARGIN, BOTTOM_INSET } from "../utils/constants";
import Shadows from "./Shadows";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

THRESHOLD_VELOCITY = 500;

export default class ScrollHeader extends Component {
  constructor(props) {
    super(props);

    this.minHeight = props.minHeight;

    this.state = {
      status: HEADER_STATUS.CLOSED,
      containerHeight: viewportHeight - STATUS_BAR_MARGIN,
      contentHeight: viewportHeight,
      initialized: false,
      pointerEvent: "box-none"
    };
  }

  scrollY = new Animated.Value(0);
  lastScrollY = 0;
  isKeyboardOpen = false;

  onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: this.scrollY } }],
    { useNativeDriver: true }
  );

  componentDidMount() {
    this.keyboardEventListeners = [
      Keyboard.addListener("keyboardDidShow", this.setKeyboardState(true)),
      Keyboard.addListener("keyboardDidHide", this.setKeyboardState(false))
    ];
  }

  setKeyboardState = open => () => (this.isKeyboardOpen = open);

  componentWillUnmount() {
    this.keyboardEventListeners.forEach(ls => ls.remove());
  }

  onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.setPointerEvent("auto");

      const { velocityY: v, translationY } = event.nativeEvent;
      const containerHeight = this.state.containerHeight;

      if (this.state.status === HEADER_STATUS.CLOSED) {
        if (
          (translationY < containerHeight / 2 && v < THRESHOLD_VELOCITY) ||
          (translationY >= containerHeight / 2 && v < -THRESHOLD_VELOCITY)
        ) {
          this.scrollTo(0, HEADER_STATUS.CLOSED, v);
        } else {
          this.scrollTo(
            containerHeight - this.minHeight,
            HEADER_STATUS.PENDING,
            v
          );
        }
      } else if (this.state.status === HEADER_STATUS.PENDING) {
        if (translationY <= 0 && v <= -THRESHOLD_VELOCITY) {
          this.scrollTo(
            -(containerHeight - this.minHeight),
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
          Math.max(containerHeight - this.minHeight, this.lastScrollY)
        );
        this.scrollY.setOffset(this.lastScrollY);
        this.scrollY.setValue(0);
        if (this.lastScrollY === containerHeight - this.minHeight) {
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
    const containerHeight = this.state.containerHeight;

    switch (status) {
      case HEADER_STATUS.CLOSED:
        minScroll = 0;
        maxScroll = containerHeight - this.minHeight;
        break;

      case HEADER_STATUS.PENDING:
        minScroll = 0;
        maxScroll = this.state.contentHeight;
        break;

      case HEADER_STATUS.OPEN:
        minScroll = containerHeight - this.minHeight;
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
    const {
      status,
      contentHeight,
      initialized,
      pointerEvent,
      containerHeight
    } = this.state;

    const { minScroll, maxScroll } = this.getConstraints(status);

    return (
      <View
        style={{
          ...StyleSheet.absoluteFill,
          elevation: 10,
          zIndex: 10,
          overflow: "hidden"
        }}
        pointerEvents={pointerEvent}
        onLayout={this.onContainerLayout}
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
            bottom: initialized
              ? undefined
              : containerHeight - this.minHeight + BOTTOM_INSET,
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
                minHeight: containerHeight,
                transform: [
                  {
                    translateY: this.scrollY.interpolate({
                      inputRange: [minScroll, maxScroll],
                      outputRange: [minScroll, maxScroll],
                      extrapolate: "clamp"
                    })
                  }
                ],
                ...Shadows[4]
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
    this.setState({
      initialized: true,
      contentHeight: Math.max(
        event.nativeEvent.layout.height,
        this.state.containerHeight - this.minHeight
      )
    });
  };

  onContainerLayout = event => {
    !this.isKeyboardOpen &&
      this.setState({
        containerHeight: event.nativeEvent.layout.height + 1
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
