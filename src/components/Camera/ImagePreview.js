import React, { Component } from "react";
import {
  View,
  Animated,
  ImageBackground,
  Easing,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../Button";
import { cameraPreview as cameraPreviewStyle, generalStyle } from "./styles";

export default class ImagePreview extends Component {
  constructor(props) {
    super(props);

    this._active = new Animated.Value(0);

    this._style = {
      ...Platform.select({
        ios: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1]
              })
            }
          ],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10]
          })
        },

        android: {
          transform: [
            {
              scale: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.07]
              })
            }
          ],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6]
          })
        }
      })
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.active !== prevProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(this.props.active)
      }).start();
    }
  }

  render() {
    const { item } = this.props;
    if (item)
      return (
        <Animated.View style={[cameraPreviewStyle.itemContainer, this._style]}>
          <ImageBackground
            style={cameraPreviewStyle.imagePreview}
            source={item}
            resizeMode="cover"
          >
            <Button
              style={cameraPreviewStyle.deletePreviewBtn}
              onPress={this._local_deleteItem}
            >
              <Icon name="times-circle" size={20} style={generalStyle.w} />
            </Button>
          </ImageBackground>
        </Animated.View>
      );
    else
      return (
        <View style={cameraPreviewStyle.unknownPreview}>
          <Icon name="camera" size={20} style={generalStyle.w} />
        </View>
      );
  }

  _local_deleteItem = () => {
    this.props.deleteItem(this.props.index);
  };
}
