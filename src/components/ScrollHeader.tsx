import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Platform,
  Keyboard,
  EmitterSubscription,
  LayoutChangeEvent
} from "react-native";
import {
  PanGestureHandler,
  State,
  PanGestureHandlerStateChangeEvent
} from "react-native-gesture-handler";
import colors from "../styles/colors";
import Divider from "./Divider";
import {
  STATUS_BAR_MARGIN,
  BOTTOM_INSET_DEVICES,
  BOTTOM_INSET_VALUE
} from "../utils/constants";
import Shadows from "./Shadows";
import Device from "react-native-device-info";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

const THRESHOLD_VELOCITY = 500;

interface ScrollHeaderProps {
  minHeight: number;
  renderContent: () => React.ReactNode;
  renderHeader: () => React.ReactNode;
}

type pointerEventType = "box-none" | "none" | "box-only" | "auto";

interface ScrollHeaderState {
  status: HEADER_STATUS;
  containerHeight: number;
  contentHeight: number;
  initialized: boolean;
  pointerEvent: pointerEventType;
}

export default class ScrollHeader extends Component<
  ScrollHeaderProps,
  ScrollHeaderState
> {
  keyboardEventListeners: EmitterSubscription[] = [];
  minHeight: number;
  bottomInset: number;

  constructor(props: ScrollHeaderProps) {
    super(props);

    this.minHeight = props.minHeight;

    this.state = {
      status: HEADER_STATUS.CLOSED,
      containerHeight: viewportHeight - (STATUS_BAR_MARGIN || 0),
      contentHeight: viewportHeight,
      initialized: false,
      pointerEvent: "box-none"
    };

    this.bottomInset = 0;
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
    Device.getDeviceId().then(
      (id: string) =>
        (this.bottomInset = BOTTOM_INSET_DEVICES[id] ? BOTTOM_INSET_VALUE : 0)
    );
  }

  setKeyboardState = (open: boolean) => () => (this.isKeyboardOpen = open);

  componentWillUnmount() {
    this.keyboardEventListeners.forEach(ls => ls.remove());
  }

  onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
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

  getConstraints = (
    status: HEADER_STATUS
  ): { minScroll: number; maxScroll: number } => {
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

      default:
        throw "Min | Max Scroll not set";
    }
    return { minScroll, maxScroll };
  };

  scrollTo = (toValue: number, status: HEADER_STATUS, velocity: number) => {
    status === HEADER_STATUS.CLOSED && this.setPointerEvent("box-none");
    Animated.spring(this.scrollY, {
      toValue,
      tension: 15,
      useNativeDriver: true
    }).start(() => this.updateStatus(toValue, status));
  };

  updateStatus = (toValue: number, status: HEADER_STATUS) => {
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
          ...StyleSheet.absoluteFillObject,
          elevation: 10,
          zIndex: 10,
          overflow: "hidden"
        }}
        pointerEvents={pointerEvent}
        onLayout={this.onContainerLayout}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
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
              : containerHeight - this.minHeight + this.bottomInset,
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

  onContentLayout = (event: LayoutChangeEvent) => {
    this.setState({
      initialized: true,
      contentHeight: Math.max(
        event.nativeEvent.layout.height,
        this.state.containerHeight - this.minHeight
      )
    });
  };

  onContainerLayout = (event: LayoutChangeEvent) => {
    !this.isKeyboardOpen &&
      this.setState({
        containerHeight: event.nativeEvent.layout.height + 1
      });
  };

  setPointerEvent = (pointerEvent: pointerEventType) => {
    this.setState({
      pointerEvent
    });
  };
}

enum HEADER_STATUS {
  CLOSED = "CLOSED",
  PENDING = "PENDING",
  OPEN = "OPEN"
}
