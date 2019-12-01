import React, { Component } from "react";
import { View, FlatList } from "react-native";
import Button from "../Button";
import colors from "../../styles/colors";
import CameraPreviews from "./CameraPreviews";
import Icon from "react-native-vector-icons/FontAwesome";
import { header as headerStyle, generalStyle } from "./styles";
import _ from "lodash";
import { SellImage } from "../../store/sell/types";

interface CameraHeaderProps {
  previews: SellImage[];
  handleGoBack: () => void;
  _reorderPreviews: (order: number[]) => void;
  deleteItem: (index: number) => void;
  handleGoNext: () => void;
}

export class CameraHeader extends Component<CameraHeaderProps> {
  render() {
    const {
      previews,
      handleGoBack,
      _reorderPreviews,
      deleteItem,
      handleGoNext
    } = this.props;

    let hasPreviews = previews.length > 0;

    return (
      <View style={headerStyle.container}>
        <Button onPress={handleGoBack} style={headerStyle.button}>
          <Icon name="chevron-left" size={30} style={generalStyle.w} />
        </Button>
        <View style={{ flex: 1 }}>
          <CameraPreviews
            previews={previews}
            _reorderPreviews={_reorderPreviews}
            deleteItem={deleteItem}
          />
        </View>
        <Button
          style={headerStyle.button}
          onPress={handleGoNext}
          disabled={!hasPreviews}
        >
          <Icon
            name="arrow-circle-right"
            size={30}
            style={{
              color: !hasPreviews ? colors.lightGrey : colors.secondary
            }}
          />
        </Button>
      </View>
    );
  }
}

export default CameraHeader;
