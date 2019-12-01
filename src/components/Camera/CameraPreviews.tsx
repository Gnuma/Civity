import React, { Component } from "react";
import { Text, View } from "react-native";
import ImagePreview from "./ImagePreview";
import SortableList, { RowProps } from "react-native-sortable-list";
import { cameraPreview as cameraPreviewStyle } from "./styles";
import { SellImage } from "../../store/sell/types";

interface CameraPreviewsProps {
  previews: SellImage[];
  _reorderPreviews: (order: number[]) => void;
  deleteItem: (index: number) => void;
}

interface CameraPreviewsState {}

export class CameraPreviews extends Component<
  CameraPreviewsProps,
  CameraPreviewsState
> {
  constructor(props: CameraPreviewsProps) {
    super(props);

    this.state = {
      draggedFocus: null
    };
  }

  render() {
    const { previews, _reorderPreviews } = this.props;
    return (
      <SortableList
        horizontal
        style={cameraPreviewStyle.container}
        data={previews}
        renderRow={this._renderItem}
        rowActivationTime={0}
        onChangeOrder={_reorderPreviews}
      />
    );
  }

  _renderItem = ({ data, index }: RowProps<SellImage | null, number>) => {
    return (
      <ImagePreview
        item={data}
        index={index}
        deleteItem={this.props.deleteItem}
      />
    );
  };
}

export default CameraPreviews;
