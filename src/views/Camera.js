import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import ImageEditor from "@react-native-community/image-editor";
import RNFS from "react-native-fs";
import { connect } from "react-redux";
import { RNCamera } from "react-native-camera";
import CameraHeader from "../components/Camera/CameraHeader";
import * as sellActions from "../store/actions/sell";
import colors from "../styles/colors";
import _ from "lodash";
import MainCamera from "../components/Camera/MainCamera";
import { TransparentBar } from "../components/StatusBars";
import { SafeAreaView } from "react-navigation";
import ImageReviewer from "../components/Camera/ImageReviewer";
import { ___BOOK_IMG_RATIO___, SellType } from "../utils/constants";

export class Camera extends Component {
  imgCounter = 5;
  camera = null;

  state = {
    flashMode: RNCamera.Constants.FlashMode.off,
    loading: false,
    cameraStatus: null,
    loading: 0
  };

  openImagePicker = () => {
    this.props.navigation.navigate("ImagePicker");
  };

  takePicture = async () => {
    if (this.camera && !this.state.loading) {
      if (this.imgCounter > 0) {
        this.setState({
          loading: true
        });
        await this.camera
          .takePictureAsync(options)
          .then(data => {
            this.setState(prevState => ({
              loading: false
            }));
            this.props.addReview(data);
            this.imgCounter--;
            //setTimeout(() => this.camera.resumePreview(), 500);
          })
          .catch(err => {
            console.log(err);
            this.setState({
              loading: false
            });
            this.camera.resumePreview();
          });
      }
    }
  };

  handleReview = (isAccepted, img, offsetPercentage, sizePercentage) => {
    if (isAccepted) {
      const offset = {
        x: Math.round(img.width * offsetPercentage.x),
        y: Math.round(img.height * offsetPercentage.y)
      };
      const size = {
        width: Math.round(img.width * sizePercentage.width),
        height: Math.round(img.height * sizePercentage.height)
      };
      let displaySize = {
        width: Math.min(IMAGE_MAX_WIDTH, size.width)
      };
      displaySize.height = displaySize.width * ___BOOK_IMG_RATIO___;

      console.log(img, offset, size, displaySize);
      const uri = img.uri;
      ImageEditor.cropImage(uri, {
        offset,
        size,
        displaySize
      })
        .then(uri => RNFS.readFile(uri, "base64"))
        .then(base64 => this.props.takePreviewRedux({ base64, uri }))
        .catch(err => console.warn("Err: ", err));
    }
    this.props.removeReview();
  };

  handleGoNext = () => {
    if (this.props.type === SellType.NEW) {
      this.props.navigation.navigate("SelectBook");
    } else {
      this.props.navigation.navigate("VendiInfos");
    }
  };

  changeFlashMode = () => {
    this.setState(prevState => ({
      flashMode:
        prevState.flashMode === RNCamera.Constants.FlashMode.off
          ? RNCamera.Constants.FlashMode.on
          : RNCamera.Constants.FlashMode.off
    }));
  };

  handleGoBack = () => {
    this.props.navigation.goBack(null);
  };

  deleteItem = index => {
    this.props.deletePreviewRedux(index);
    this.imgCounter++;
  };

  _reorderPreviews = nextOrder => {
    this.props.setPreviewsOrderRedux(nextOrder);
  };

  render() {
    const isReviewing = !_.isEmpty(this.props.checking);
    const { flashMode, loading } = this.state;
    const { previews, previewsOrder } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.fullBlack }}>
        <View style={{ flex: 1 }}>
          <TransparentBar />
          {!isReviewing && (
            <MainCamera
              flashMode={flashMode}
              initCamera={this.initCamera}
              cameraStatusChange={this.cameraStatusChange}
              takePicture={this.takePicture}
              changeFlashMode={this.changeFlashMode}
              openImagePicker={this.openImagePicker}
              loading={loading}
            />
          )}
          <CameraHeader
            previews={previews}
            previewsOrder={previewsOrder}
            handleGoBack={this.handleGoBack}
            _reorderPreviews={this._reorderPreviews}
            deleteItem={this.deleteItem}
            previewsOrder={previewsOrder}
            handleGoNext={this.handleGoNext}
          />
          <View style={{ flex: 1 }}>
            {isReviewing && (
              <ImageReviewer
                data={this.props.checking[0]}
                setReviewOptions={this.setReviewOptions}
                handleReview={this.handleReview}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  renderLoader = () => {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center" }
        ]}
      >
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  };

  initCamera = camera => {
    if (camera) {
      if (!this.camera)
        this.setState({
          cameraStatus: camera.getStatus()
        });

      this.camera = camera;
    }
  };

  cameraStatusChange = ({ cameraStatus }) => {
    this.setState({
      cameraStatus
    });
  };
}

const mapStateToProps = state => ({
  previews: state.sell.previews,
  previewsOrder: state.sell.previewsOrder,
  checking: state.sell.checking,
  type: state.sell.type
});

const mapDispatchToProps = dispatch => {
  return {
    takePreviewRedux: data => dispatch(sellActions.takePreview(data)),
    setPreviewsOrderRedux: nextOrder =>
      dispatch(sellActions.setPreviewsOrder(nextOrder)),
    deletePreviewRedux: index => dispatch(sellActions.deletePreview(index)),
    addReview: data => dispatch(sellActions.sellAddReview(data)),
    removeReview: () => dispatch(sellActions.sellRemoveReview())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera);

const options = {
  quality: 1,
  orientation: "portrait",
  fixOrientation: true,
  forceUpOrientation: true,
  pauseAfterCapture: true
  //width: 1080,
  //skipProcessing: true
};

const IMAGE_MAX_HEIGHT = 1280;
const IMAGE_MAX_WIDTH = 960;
