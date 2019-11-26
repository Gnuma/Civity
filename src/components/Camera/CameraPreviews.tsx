import React, { Component } from "react";
import { Text, View } from "react-native";
import ImagePreview from "./ImagePreview";
import SortableList, { RowProps } from "react-native-sortable-list";
import { cameraPreview as cameraPreviewStyle } from "./styles";
import { PreviewImage } from "../../store/sell_Deprecated/types";

interface CameraPreviewsProps {
  previews: { [key: number]: PreviewImage | null };
  _reorderPreviews: (order: number[]) => void;
  previewsOrder: number[];
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
    const { previews, _reorderPreviews, previewsOrder } = this.props;
    return (
      <SortableList
        horizontal
        style={cameraPreviewStyle.container}
        data={previews}
        renderRow={this._renderItem}
        rowActivationTime={0}
        onChangeOrder={_reorderPreviews}
        order={previewsOrder}
      />
    );
  }

  _renderItem = ({ data, index }: RowProps<PreviewImage | null, number>) => {
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
