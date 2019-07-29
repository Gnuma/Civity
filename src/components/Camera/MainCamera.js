import React, { Component } from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  ImageEditor,
  ImageStore
} from "react-native";
import { RNCamera } from "react-native-camera";
import { Header2 } from "../Text";
import CameraBottom from "./CameraBottom";
import CameraHeader from "./CameraHeader";
import colors from "../../styles/colors";

export default class MainCamera extends Component {
  render() {
    const {
      flashMode,
      initCamera,
      cameraStatusChange,
      takePicture,
      changeFlashMode,
      openImagePicker,
      loading
    } = this.props;

    return (
      <View style={{ ...StyleSheet.absoluteFill, justifyContent: "flex-end" }}>
        <RNCamera
          style={StyleSheet.absoluteFill}
          type={RNCamera.Constants.Type.back}
          flashMode={flashMode}
          captureAudio={false}
          autoFocusPointOfInterest={{ x: 0.5, y: 0.5 }}
          ref={initCamera}
          onStatusChange={cameraStatusChange}
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
