import React, { Component } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import PropTypes from "prop-types";
import {
  PinchGestureHandler,
  PanGestureHandler,
  State
} from "react-native-gesture-handler";
import colors from "../../styles/colors";
import { ___BOOK_IMG_RATIO___ } from "../../utils/constants";
import Button from "../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import ImageSize from "react-native-image-size";

export default class ImageReviewer extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    setReviewOptions: PropTypes.func,
    handleReview: PropTypes.func
  };

  state = {
    loading: true,
    right_c: null,
    bottom_c: null,
    left_c: null,
    top_c: null,
    scale_c: null
  };

  pan = new Animated.ValueXY();
  lastPan = { x: 0, y: 0 };

  baseScale = new Animated.Value(1);
  pinchScale = new Animated.Value(1);
  scale = Animated.multiply(this.baseScale, this.pinchScale);
  lastScale = 1;
  initialized = false;

  componentDidUpdate(prevProps) {
    if (prevProps.data.uri !== this.props.data.uri) {
      this.updateLayout();
    }
  }

  updateLayout = async () => {
    const margin = 0.2;
    console.log(this.props.data);
    this.lastPan = { x: 0, y: 0 };
    this.pan.setValue(this.lastPan);
    this.pan.setOffset(this.lastPan);

    this.lastScale = 1;
    this.baseScale.setValue(1);
    this.baseScale.setOffset(0);
    this.pinchScale.setValue(1);
    this.pinchScale.setOffset(0);

    const { data } = this.props;
    const { container } = this.state;
    //const { width: imgWidth, height: imgHeight } =
    //  !this.props.data.width || !this.props.data.height
    //    ? await getImageSize(data.uri)
    //    : data;
    let { width: imgWidth, height: imgHeight } =
      !this.props.data.width || !this.props.data.height
        ? await getImageSize(data.uri)
        : data;

    console.log(imgWidth, imgHeight);

    //console.log(Image.resolveAssetSource(data.uri));

    const imgRatio = imgHeight / imgWidth;
    let layoutHeight, layoutWidth;
    let cropperHeight, cropperWidth;
    if (this.container.width * imgRatio > this.container.height) {
      console.log("HEIGHT LIMIT");
      layoutHeight = this.container.height;
      layoutWidth = this.container.height / imgRatio;
      cropperWidth = layoutWidth - margin * layoutWidth;
      cropperHeight = cropperWidth * ___BOOK_IMG_RATIO___;
    } else {
      console.log("WIDTH LIMIT");
      layoutWidth = this.container.width;
      layoutHeight = this.container.width * imgRatio;
      cropperHeight = layoutHeight - margin * layoutHeight;
      cropperWidth = cropperHeight / ___BOOK_IMG_RATIO___;
    }
    if (layoutWidth * ___BOOK_IMG_RATIO___ > layoutHeight) {
      cropperHeight = layoutHeight - margin * layoutHeight;
      cropperWidth = cropperHeight / ___BOOK_IMG_RATIO___;
    } else {
      cropperWidth = layoutWidth - margin * layoutWidth;
      cropperHeight = cropperWidth * ___BOOK_IMG_RATIO___;
    }

    const horizontalConstraint = Math.max(0, (layoutWidth - cropperWidth) / 2);
    const verticalConstraint = Math.max(0, (layoutHeight - cropperHeight) / 2);
    const horizontalScaleConstraint = cropperWidth / layoutWidth;
    const verticalScaleConstraint = cropperHeight / layoutHeight;

    const scaleConstraint = Math.max(
      horizontalScaleConstraint,
      verticalScaleConstraint
    );

    console.log(horizontalConstraint, verticalConstraint);

    this.setState({
      img: {
        width: imgWidth,
        height: imgHeight,
        uri: data.uri
      },
      layout: {
        height: layoutHeight,
        width: layoutWidth
      },
      left_c: -horizontalConstraint,
      right_c: horizontalConstraint,
      top_c: -verticalConstraint,
      bottom_c: verticalConstraint,
      scale_c: scaleConstraint,
      cropper: {
        height: cropperHeight,
        width: cropperWidth
      },
      loading: false
    });
  };

  handleReview = isValid => {
    if (isValid) {
      const {
        cropper: { width: cropperWidth, height: cropperHeight },
        layout: { width: layoutWidth, height: layoutHeight }
      } = this.state;

      const fullWidth = layoutWidth * this.lastScale;
      const fullHeight = layoutHeight * this.lastScale;

      const widthPercentage = cropperWidth / fullWidth;
      const heightPercentage = cropperHeight / fullHeight;

      const xOffset = (fullWidth - cropperWidth) / 2 - this.lastPan.x;
      const yOffset = (fullHeight - cropperHeight) / 2 - this.lastPan.y;

      const xPercentage = xOffset / fullWidth;
      const yPercentage = yOffset / fullHeight;

      console.log(
        this.state.img,
        { x: xPercentage, y: yPercentage },
        { width: widthPercentage, height: heightPercentage }
      );

      this.props.handleReview(
        true,
        this.state.img,
        { x: xPercentage, y: yPercentage },
        { width: widthPercentage, height: heightPercentage }
      );
    } else {
      this.props.handleReview(false);
    }
  };

  onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: this.pan.x, translationY: this.pan.y } }],
    {
      useNativeDriver: true
    }
  );

  onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: this.pinchScale } }],
    { useNativeDriver: true }
  );

  onPanGestureChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastPan.x += event.nativeEvent.translationX;
      this.lastPan.y += event.nativeEvent.translationY;
      this.lastPan.x = Math.min(
        Math.max(this.state.left_c, this.lastPan.x),
        this.state.right_c
      );
      this.lastPan.y = Math.max(
        Math.min(this.state.bottom_c, this.lastPan.y),
        this.state.top_c
      );
      this.pan.setOffset({
        x: this.lastPan.x,
        y: this.lastPan.y
      });
      this.pan.setValue({ x: 0, y: 0 });
      this.updateScaleConstraints();
    }
  };

  onPinchStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastScale *= event.nativeEvent.scale;
      this.lastScale = Math.max(this.lastScale, this.state.scale_c);
      this.baseScale.setValue(this.lastScale);
      this.pinchScale.setValue(1);
      this.updateTranslationConstaints();
    }
  };

  updateScaleConstraints = () => {
    const {
      cropper: { width: cropperWidth, height: cropperHeight },
      layout: { width: layoutWidth, height: layoutHeight }
    } = this.state;
    console.log(this.lastPan.x, this.state.right_c);
    const horizontalScaleConstaint = Math.min(
      Math.abs(this.lastPan.x + this.state.left_c),
      Math.abs(this.lastPan.x + this.state.right_c)
    );
    const verticalScaleConstraint = Math.min(
      Math.abs(this.lastPan.y + this.state.top_c),
      Math.abs(this.lastPan.y + this.state.bottom_c)
    );

    const OuterWidth = layoutWidth * this.lastScale;
    const OuterHeight = layoutHeight * this.lastScale;
    const InnerWidth = OuterWidth - horizontalScaleConstaint * 2;
    const InnerHeight = OuterHeight - verticalScaleConstraint * 2;
    const scaleOffsetConstraint = Math.max(
      InnerWidth / OuterWidth,
      InnerHeight / OuterHeight
    );
    console.log(scaleOffsetConstraint, this.lastScale);
    this.setState({
      scale_c: this.lastScale * scaleOffsetConstraint
    });
  };

  updateTranslationConstaints = () => {
    const bugOffset = 0;
    const {
      cropper: { width: cropperWidth, height: cropperHeight },
      layout: { width: layoutWidth, height: layoutHeight }
    } = this.state;

    const horizontalConstraint =
      Math.max(0, layoutWidth * this.lastScale - cropperWidth) / 2 + bugOffset;
    const verticalConstraint =
      Math.max(0, layoutHeight * this.lastScale - cropperHeight) / 2 +
      bugOffset;

    this.setState({
      left_c: -horizontalConstraint,
      right_c: horizontalConstraint,
      top_c: -verticalConstraint,
      bottom_c: verticalConstraint
    });

    console.log("UPDATING TRANSLATIONAL CONSTRAINTS", {
      left_c: -horizontalConstraint,
      right_c: horizontalConstraint,
      top_c: -verticalConstraint,
      bottom_c: verticalConstraint
    });
    console.log(this.lastPan);
  };

  render() {
    const {
      layout,
      loading,
      img,
      cropper,
      left_c,
      right_c,
      top_c,
      bottom_c,
      scale_c
    } = this.state;
    console.log(cropper);
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1
          }}
          onLayout={event => this.setContainerSize(event.nativeEvent)}
        >
          <Handlers
            onPanGestureChange={this.onPanGestureChange}
            onPanGestureEvent={this.onPanGestureEvent}
            onPinchGestureEvent={this.onPinchGestureEvent}
            onPinchStateChange={this.onPinchStateChange}
          >
            {!loading && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  backgroundColor: colors.fullBlack
                }}
              >
                <View
                  style={{
                    height: layout.height,
                    width: layout.width,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Animated.Image
                    style={{
                      ...StyleSheet.absoluteFill,
                      transform: [
                        {
                          translateX: this.pan.x.interpolate({
                            inputRange: [
                              left_c - BUG_OFFSET,
                              right_c + BUG_OFFSET
                            ],
                            outputRange: [
                              left_c - BUG_OFFSET,
                              right_c + BUG_OFFSET
                            ],
                            extrapolate: "clamp"
                          })
                        },
                        {
                          translateY: this.pan.y.interpolate({
                            inputRange: [
                              top_c - BUG_OFFSET,
                              bottom_c + BUG_OFFSET
                            ],
                            outputRange: [
                              top_c - BUG_OFFSET,
                              bottom_c + BUG_OFFSET
                            ],
                            extrapolate: "clamp"
                          })
                        },
                        {
                          scale: this.scale.interpolate({
                            inputRange: [scale_c, 100],
                            outputRange: [scale_c, 100],
                            extrapolate: "clamp"
                          })
                        }
                      ]
                    }}
                    resizeMode="contain"
                    source={{ uri: img.uri }}
                  />
                </View>
                <Overlay container={this.container} cropper={cropper} />
              </View>
            )}
          </Handlers>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 15
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              elevation: 4,
              borderRadius: 6
            }}
          >
            <Button
              onPress={() => this.handleReview(true)}
              style={{ borderRightWidth: 0.5, borderColor: colors.grey }}
            >
              <Icon
                name="check"
                style={{
                  color: colors.secondary,
                  paddingHorizontal: 10,
                  paddingVertical: 3
                }}
                size={40}
              />
            </Button>
            <Button onPress={() => this.handleReview(false)}>
              <Icon
                name="times"
                style={{
                  color: colors.red,
                  paddingHorizontal: 10,
                  paddingVertical: 3
                }}
                size={40}
              />
            </Button>
          </View>
        </View>
      </View>
    );
  }

  setContainerSize = ({ layout }) => {
    this.container = {
      width: layout.width,
      height: layout.height
    };
    if (!this.initialized) {
      this.initialized = true;
      this.updateLayout();
    }
  };
}

const getImageSize = uri =>
  new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      err => reject(err)
    );
  });

const Handlers = ({
  onPanGestureEvent,
  onPanGestureChange,
  onPinchGestureEvent,
  onPinchStateChange,
  children
}) => {
  return (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanGestureChange}
      maxPointers={1}
    >
      <Animated.View style={{ flex: 1 }}>
        <PinchGestureHandler
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchStateChange}
        >
          <Animated.View style={{ flex: 1, justifyContent: "center" }}>
            {children}
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

const BUG_OFFSET = Math.pow(10, -5);

const Overlay = ({ cropper, container }) => {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFill
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.65)"
        }}
      />
      <View
        style={{
          height: cropper.height,
          flexDirection: "row"
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.65)"
          }}
        />
        <View
          style={{
            width: cropper.width,
            borderColor: colors.white,
            borderWidth: 2,
            borderStyle: "dashed",
            borderRadius: 4,
            margin: -1,
            zIndex: 2,
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderLeftWidth: 4,
                borderTopWidth: 4,
                borderColor: colors.white
              }}
            />
            <View
              style={{
                width: 20,
                height: 20,
                borderRightWidth: 4,
                borderTopWidth: 4,
                borderColor: colors.white
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderLeftWidth: 4,
                borderBottomWidth: 4,
                borderColor: colors.white
              }}
            />
            <View
              style={{
                width: 20,
                height: 20,
                borderRightWidth: 4,
                borderBottomWidth: 4,
                borderColor: colors.white
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.65)"
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.65)"
        }}
      />
    </View>
  );
};
