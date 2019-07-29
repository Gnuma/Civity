import React, { Component } from "react";
import { Text, View } from "react-native";
import ImagePreview from "./ImagePreview";
import SortableList from "react-native-sortable-list";
import { cameraPreview as cameraPreviewStyle } from "./styles";

export class CameraPreviews extends Component {
  constructor(props) {
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

  _renderItem = ({ data, index }) => {
    return (
      <ImagePreview
        item={data}
        index={index}
        deleteItem={this.props.deleteItem}
      />
    );
  };

  _keyExtractor = (item, index) => {
    return index.toString();
  };
}

export default CameraPreviews;
