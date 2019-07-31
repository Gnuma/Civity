import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
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

export default class ScrollHeader extends Component {
  constructor(props) {
    super(props);

    this.minHeight = props.minHeight;
    this.maxHeight = viewportHeight;
    this.deltaY = this.maxHeight - this.minHeight;

    this.state = {
      status: HEADER_STATUS.CLOSED,
      contentHeight: viewportHeight
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
      this.props.setPointerEvent("none");

      const { velocityY: v, translationY } = event.nativeEvent;
      const { height: windowHeight } = Dimensions.get("window");

      if (this.state.status === HEADER_STATUS.CLOSED) {
        if (v <= 0) {
          this.scrollTo(0, HEADER_STATUS.CLOSED, v);
        } else {
          this.scrollTo(
            windowHeight - this.minHeight,
            HEADER_STATUS.PENDING,
            v
          );
        }
      } else if (this.state.status === HEADER_STATUS.PENDING) {
        if (v <= -500) {
          this.scrollTo(
            -(windowHeight - this.minHeight),
            HEADER_STATUS.CLOSED,
            v
          );
        } else if (v > 500 && v < 500) {
          this.scrollTo(0, HEADER_STATUS.PENDING, v);
        } else {
          this.lastScrollY += translationY;
          this.lastScrollY = Math.min(
            this.lastScrollY,
            this.state.contentHeight
          );
          this.scrollY.setOffset(this.lastScrollY);
          this.scrollY.setValue(0);
          if (this.lastScrollY !== this.state.contentHeight)
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
    }
  };

  getConstraints = status => {
    let minScroll, maxScroll;
    const { height: windowHeight } = Dimensions.get("window");

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
    status === HEADER_STATUS.CLOSED && this.props.setPointerEvent("auto");
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
    const { status } = this.state;
    const { height: windowHeight } = Dimensions.get("window");
    const { height: screenHeight } = Dimensions.get("screen");

    const { minScroll, maxScroll } = this.getConstraints(status);

    return (
      <View
        style={{
          position: "absolute",
          bottom: windowHeight - this.minHeight,
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
            <TouchableWithoutFeedback
              style={{ flex: 1, justifyContent: "flex-end" }}
              onStartShouldSetResponder={() => console.log("Ao")}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  backgroundColor: "red"
                }}
              >
                <View onLayout={this.onContentLayout}>
                  {this.props.renderContent()}
                </View>
                <Divider />
                {this.renderHeader()}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }

  renderHeader = () => {
    return (
      <View style={[{ height: this.minHeight }, styles.container]}>
        <Button style={styles.goBackBtn}>
          <Icon name={"chevron-left"} size={24} style={styles.backIcon} />
        </Button>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Header1 color={"primary"} style={{ flex: 1 }} numberOfLines={1}>
            Nome utente
          </Header1>
          <FullButton value="Test" style={{ marginHorizontal: 10 }} />
        </View>
      </View>
    );
  };

  onContentLayout = event => {
    const { height: windowHeight } = Dimensions.get("window");
    this.setState({
      contentHeight: Math.max(
        event.nativeEvent.layout.height,
        windowHeight - this.minHeight
      )
    });
  };
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

const HEADER_STATUS = {
  CLOSED: "CLOSED",
  PENDING: "PENDING",
  OPEN: "OPEN"
};
