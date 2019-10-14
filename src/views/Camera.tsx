import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import ImageEditor from "@react-native-community/image-editor";
import RNFS from "react-native-fs";
import { connect } from "react-redux";
import { RNCamera, FlashMode, TakePictureOptions } from "react-native-camera";
import * as sellActions from "../store/sell";
import colors from "../styles/colors";
import _ from "lodash";
import { TransparentBar, HiddenBar } from "../components/StatusBars";
import { SafeAreaView, NavigationEventSubscription } from "react-navigation";
import { ___BOOK_IMG_RATIO___, SellType, IS_ANDROID } from "../utils/constants";
import { setLightContent } from "../components/StatusBars";
import ImagePicker, { Image } from "react-native-image-crop-picker";
import Permissions from "react-native-permissions";
import { Header3 } from "../components/Text";
import { NavigationStackProp } from "react-navigation-stack";
import MainCamera from "../components/Camera/MainCamera";
import CameraHeader from "../components/Camera/CameraHeader";
import ImageReviewer from "../components/Camera/ImageReviewer";
import { StoreType, rootReducer } from "../store/root";
import { Dispatch, AnyAction } from "redux";
import {
  SellType as SellTypeStore,
  PreviewImage,
  CheckingImage,
  SellProcessType
} from "../store/sell/types";
import { ThunkDispatch } from "redux-thunk";
import sellReducer from "../store/sell/reducer";

interface CameraProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

interface CameraState {
  flashMode: "on" | "off" | "torch" | "auto";
  loading: boolean;
  camerStatus?: any;
  hasPermission?: boolean;
}

export class Camera extends Component<CameraProps, CameraState> {
  imgCounter = 5;
  camera?: RNCamera;
  isImagePickerOpen = false;
  _navListener?: NavigationEventSubscription;

  state: CameraState = {
    flashMode: RNCamera.Constants.FlashMode.off,
    loading: false,
    hasPermission: undefined
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener(
      "willFocus",
      setLightContent
    );
    setLightContent();
    this.requestPermissions();
  }

  componentWillUnmount() {
    this._navListener && this._navListener.remove();
  }

  openImagePicker = () => {
    let busyPreviews = 0;
    for (let key in this.props.previews)
      if (this.props.previews[key] !== null) busyPreviews++;
    if (busyPreviews !== 5) {
      if (IS_ANDROID)
        this.props.navigation.navigate("ImagePicker", {
          occupied: busyPreviews
        });
      else if (!this.isImagePickerOpen) {
        this.isImagePickerOpen = true;
        ImagePicker.openPicker({
          ...PICKER_CONFIG,
          maxFiles: 5 - busyPreviews
        })
          .then(data => {
            if (!Array.isArray(data)) data = [data];
            const imagesToReview: CheckingImage[] = [];
            for (let i = 0; i < data.length; i++) {
              imagesToReview.push({ ...data[i], uri: data[i].path });
            }
            this.props.addReview(imagesToReview);
            this.isImagePickerOpen = false;
          })
          .catch(err => (this.isImagePickerOpen = false));
      }
    }
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
            this.camera && this.camera.resumePreview();
          });
      }
    }
  };

  handleReview = (
    isAccepted: boolean,
    img?: CheckingImage,
    offsetPercentage?: {
      x: number;
      y: number;
    },
    sizePercentage?: {
      width: number;
      height: number;
    }
  ) => {
    if (isAccepted == true) {
      if (!img || !offsetPercentage || !sizePercentage)
        return this.props.removeReview();
      const offset = {
        x: Math.round(img.width * offsetPercentage.x),
        y: Math.round(img.height * offsetPercentage.y)
      };
      const size = {
        width: Math.round(img.width * sizePercentage.width),
        height: Math.round(img.height * sizePercentage.height)
      };
      let displaySize: any = {
        width: Math.min(IMAGE_MAX_WIDTH, size.width)
      };
      displaySize.height = displaySize.width * ___BOOK_IMG_RATIO___;

      console.log(img, offset, size, displaySize);
      const uri = img.uri;
      if (!uri) return;
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

  deleteItem = (index: number) => {
    this.props.deletePreviewRedux(index);
    this.imgCounter++;
  };

  _reorderPreviews = (nextOrder: number[]) => {
    this.props.setPreviewsOrderRedux(nextOrder);
  };

  renderMainCamera = () => {
    const { flashMode, loading, hasPermission } = this.state;
    if (hasPermission === null) return null;
    else if (hasPermission)
      return (
        <MainCamera
          flashMode={flashMode}
          initCamera={this.initCamera}
          takePicture={this.takePicture}
          changeFlashMode={this.changeFlashMode}
          openImagePicker={this.openImagePicker}
          loading={loading}
        />
      );
    else
      return (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center"
          }}
        >
          <TouchableOpacity onPress={this.requestPermissions}>
            <Header3
              color="white"
              style={{ textAlign: "center", margin: 20, alignSelf: "center" }}
            >
              Per accedere alla fotocamera abbiamo bisogno del tuo permesso
            </Header3>
          </TouchableOpacity>
        </View>
      );
  };

  render() {
    const isReviewing = !_.isEmpty(this.props.checking);
    const { previews, previewsOrder } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.fullBlack }}>
        {IS_ANDROID ? <TransparentBar /> : <HiddenBar />}
        {!isReviewing && this.renderMainCamera()}
        <CameraHeader
          previews={previews}
          handleGoBack={this.handleGoBack}
          _reorderPreviews={this._reorderPreviews}
          deleteItem={this.deleteItem}
          previewsOrder={previewsOrder}
          handleGoNext={this.handleGoNext}
        />
        {isReviewing && (
          <View style={{ flex: 1 }}>
            <ImageReviewer
              data={this.props.checking[0]}
              handleReview={this.handleReview}
            />
          </View>
        )}
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

  initCamera = (camera: RNCamera) => {
    if (camera) {
      this.camera = camera;
    }
  };

  requestPermissions = async () => {
    try {
      const response = await Permissions.request(
        IS_ANDROID
          ? Permissions.PERMISSIONS.ANDROID.CAMERA
          : Permissions.PERMISSIONS.IOS.CAMERA
      );
      console.log(response);
      if (response == "granted") {
        this.setState({ hasPermission: true });
      } else this.setState({ hasPermission: false });
    } catch (error) {
      this.setState({ hasPermission: false });
    }
  };
}

interface ReduxStoreProps {
  previews: { [key: number]: PreviewImage | null };
  previewsOrder: number[];
  checking: CheckingImage[];
  type?: SellProcessType;
}

const mapStateToProps = (state: StoreType): ReduxStoreProps => ({
  previews: state.sell.previews,
  previewsOrder: state.sell.previewsOrder,
  checking: state.sell.checking,
  type: state.sell.type
});

interface ReduxDispatchProps {
  takePreviewRedux: typeof sellActions.takePreview;
  setPreviewsOrderRedux: typeof sellActions.setPreviewsOrder;
  deletePreviewRedux: typeof sellActions.deletePreview;
  addReview: typeof sellActions.sellAddReview;
  removeReview: typeof sellActions.sellRemoveReview;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): ReduxDispatchProps => {
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

const options: TakePictureOptions = {
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

const PICKER_CONFIG = {
  cropping: false,
  multiple: true,
  includeExif: true,
  mediaType: "photo",
  showsSelectedCount: true
};
