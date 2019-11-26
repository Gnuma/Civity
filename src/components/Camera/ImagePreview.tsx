import React, { Component } from "react";
import { View, ImageBackground, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../Button";
import { cameraPreview as cameraPreviewStyle, generalStyle } from "./styles";
import { PreviewImage } from "../../store/sell_Deprecated/types";

interface ImagePreviewProps {
  item: PreviewImage | null;
  index?: number;
  deleteItem: (index: number) => void;
}

export default class ImagePreview extends Component<ImagePreviewProps> {
  render() {
    const { item } = this.props;
    if (item)
      return (
        <View style={cameraPreviewStyle.itemContainer}>
          <Image
            source={item}
            resizeMode="cover"
            style={cameraPreviewStyle.imagePreview}
          />
          <View style={cameraPreviewStyle.overlay}>
            <Button
              style={cameraPreviewStyle.deletePreviewBtn}
              onPress={this._local_deleteItem}
            >
              <Icon name="times-circle" size={20} style={generalStyle.w} />
            </Button>
          </View>
        </View>
      );
    else
      return (
        <View style={cameraPreviewStyle.unknownPreview}>
          <Icon name="camera" size={20} style={generalStyle.w} />
        </View>
      );
  }

  _local_deleteItem = () => {
    this.props.index && this.props.deleteItem(this.props.index);
  };
}
