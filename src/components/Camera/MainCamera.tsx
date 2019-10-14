import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { RNCamera } from "react-native-camera";
import CameraBottom from "./CameraBottom";

interface MainCameraProps {
  flashMode: "on" | "off" | "torch" | "auto";
  initCamera: (camera: RNCamera) => void;
  takePicture: () => void;
  changeFlashMode: () => void;
  openImagePicker: () => void;
  loading: boolean;
}

export default class MainCamera extends Component<MainCameraProps> {
  render() {
    const {
      flashMode,
      initCamera,
      takePicture,
      changeFlashMode,
      openImagePicker,
      loading
    } = this.props;

    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "flex-end"
        }}
      >
        <RNCamera
          style={StyleSheet.absoluteFill}
          type={RNCamera.Constants.Type.back}
          flashMode={flashMode}
          captureAudio={false}
          autoFocusPointOfInterest={{ x: 0.5, y: 0.5 }}
          ref={initCamera}
        />
        <CameraBottom
          takePicture={takePicture}
          flashMode={flashMode}
          changeFlashMode={changeFlashMode}
          openImagePicker={openImagePicker}
          loading={loading}
        />
      </View>
    );
  }
}
