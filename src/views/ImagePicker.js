import React, { Component, PureComponent } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  StatusBar,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DarkContent } from "../components/StatusBars";
import BasicHeader from "../components/BasicHeader";
import colors from "../styles/colors";
import { ___BOOK_IMG_RATIO___, IS_ANDROID } from "../utils/constants";
import update, { extend } from "immutability-helper";
import { Header3, Header1, Header2 } from "../components/Text";
import FastImage from "react-native-fast-image";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import Button from "../components/Button";
import _ from "lodash";
import Icon from "react-native-vector-icons/FontAwesome";
import * as sellActions from "../store/actions/sell";
import CameraRoll from "@react-native-community/cameraroll";
import { SafeAreaView } from "react-navigation";
import Permissions from "react-native-permissions";
import TouchableNative from "../components/TouchableNative";
import Shadows from "../components/Shadows";
import IOSToast from "../components/IOSToast";

const BATCH_SIZE = 99;

const NUM_PREVIEWS = 5;
export class ImagePicker extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      hasMore: true,
      selected: {},
      hasPermission: undefined
    };

    this.retrieveIndex = undefined;
    this.loading = false;
    this.MAX_IMAGES =
      NUM_PREVIEWS - this.props.navigation.getParam("occupied", 0);
  }

  componentDidMount() {
    if (IS_ANDROID) this.requestPermissions();
    else this.requestIosPermission();
    !IS_ANDROID && StatusBar.setBarStyle("dark-content");
  }

  renderIOS = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Header3 color="black">
          Ci dispiace ma questa funzione non e' al momemnto utilizzabile.
        </Header3>
      </View>
    );
  };

  retrieveImages = numImages => {
    this.loading = true;
    CameraRoll.getPhotos({
      first: numImages,
      after: this.retrieveIndex
    })
      .then(res => {
        this.retrieveIndex = res.page_info.end_cursor;
        this.setState(
          state =>
            update(state, {
              hasMore: { $set: res.page_info.has_next_page },
              data: { $push: res.edges }
            }),
          () => (this.loading = false)
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  togleImg = index =>
    this.setState(state =>
      update(state, {
        selected: {
          $apply: selected => {
            if (selected[index]) delete selected[index];
            else {
              if (Object.keys(selected).length < this.MAX_IMAGES)
                selected[index] = true;
              else
                IOSToast.dispatchToast(
                  "Hai raggiunto il limite di foto caricabili"
                );
            }
            return selected;
          }
        }
      })
    );

  complete = () => {
    let data = [];
    for (const key in this.state.selected)
      data.push(this.state.data[key].node.image);
    this.props.addReview(data);
    this.exitPicker();
  };

  renderItem = ({ item, index }) => {
    return (
      <ImageRoll
        item={item.node}
        id={index}
        toggle={this.togleImg}
        active={this.state.selected[index]}
      />
    );
  };

  render() {
    const { data, selected, hasPermission } = this.state;
    //console.log(data);
    if (hasPermission === undefined) {
      return null;
    }

    const numSelected = Object.keys(selected).length;
    const totalOccupied = NUM_PREVIEWS - this.MAX_IMAGES + numSelected;

    return (
      <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <IOSToast>
            <PickerHeader
              complete={this.complete}
              goBack={this.exitPicker}
              numSelected={numSelected}
              totalOccupied={totalOccupied}
            />
            {hasPermission ? (
              <View style={{ flex: 1 }}>
                {IS_ANDROID ? (
                  <FlatList
                    data={data}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    onEndReached={() => {
                      this.state.hasMore &&
                        !this.loading &&
                        this.retrieveImages(BATCH_SIZE);
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={this.renderFooter}
                    numColumns={3}
                  />
                ) : (
                  this.renderIOS()
                )}
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Header3 color="black">
                  Per accedere alle immagini abbiamo bisogno del tuo permesso
                </Header3>
              </View>
            )}
          </IOSToast>
        </View>
      </SafeAreaView>
    );
  }

  keyExtractor = (item, index) => {
    return index.toString();
  };

  exitPicker = () => this.props.navigation.goBack(null);

  renderFooter = () => {
    if (!this.state.hasMore) return null;
    return (
      <ActivityIndicator
        size="large"
        style={{ alignSelf: "center", marginVertical: 10 }}
      />
    );
  };

  requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Civity Accesso File",
          message:
            "Abbiamo bisogno del tuo permesso per farti scegliere le tue immagini",
          buttonNegative: "NO",
          buttonPositive: "SI"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ hasPermission: true });
        console.log("You can use the camera");
        this.retrieveImages(BATCH_SIZE);
      } else {
        this.setState({ hasPermission: false });
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  requestIosPermission = async () => {
    try {
      const response = await Permissions.request("photo");
      if (response == "authorized") {
        this.setState({ hasPermission: true });
        this.retrieveImages(BATCH_SIZE);
      } else this.setState({ hasPermission: false });
    } catch (error) {
      this.setState({ hasPermission: false });
    }
  };
}

const mapStateToProps = state => ({
  checking: state.sell.checking
});

const mapDispatchToProps = dispatch => {
  return {
    addReview: data => dispatch(sellActions.sellAddReview(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagePicker);

class ImageRoll extends PureComponent {
  render() {
    const { item, toggle, id, active } = this.props;

    return (
      <View style={styles.item}>
        <TouchableNative
          style={styles.itemBtn}
          onPress={() => toggle(id)}
          onLongPress={() => toggle(id)}
          delayLongPress={800}
        >
          <View style={{ flex: 1 }}>
            {IS_ANDROID ? (
              <FastImage style={StyleSheet.absoluteFill} source={item.image} />
            ) : (
              <Image
                style={{ flex: 1, resizeMode: "cover" }}
                source={item.image}
              />
            )}
            {active && (
              <View style={[styles.overlay]}>
                <Icon name="check" size={24} style={styles.overlayIcon} />
              </View>
            )}
          </View>
        </TouchableNative>
      </View>
    );
  }
}

class PickerHeader extends PureComponent {
  render() {
    const { totalOccupied, numSelected } = this.props;
    let statusBar = [];
    for (let i = 0; i < NUM_PREVIEWS; i++) {
      statusBar.push(
        <View
          key={i}
          style={[
            i < totalOccupied ? styles.statusActive : styles.statusInactive,
            i == 4 && { marginRight: 0 }
          ]}
        />
      );
    }

    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Button onPress={this.props.goBack} style={styles.goBtn}>
            <Icon name="chevron-left" size={24} style={styles.backIcon} />
          </Button>
          <View style={{ flex: 1 }}>
            <View>
              <Header1 color={"primary"}>{"Seleziona le foto"}</Header1>
            </View>
          </View>
          <Button
            onPress={this.complete}
            disabled={numSelected == 0}
            style={styles.goBtn}
            onPress={this.props.complete}
          >
            <Icon
              name="arrow-circle-right"
              size={34}
              style={[
                styles.completeIcon,
                numSelected == 0 && { color: colors.lightGrey }
              ]}
            />
          </Button>
        </View>
        <View style={styles.headerStatus}>{statusBar}</View>
      </View>
    );
  }
}

const margin = 3;

const { width: screenWidth } = Dimensions.get("screen");
const itemWidth = (screenWidth - margin * 4) / 3;
const itemHeight = itemWidth;

const styles = StyleSheet.create({
  item: {
    width: itemWidth,
    height: itemHeight,
    ...Shadows[2],
    backgroundColor: colors.white,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: margin,
    marginLeft: margin
  },
  itemBtn: {
    width: itemWidth,
    height: itemHeight
  },
  row: {
    marginTop: margin,
    flexDirection: "row"
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    borderColor: colors.secondary,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  overlayIcon: {
    color: colors.white
  },
  selector: {
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    ...Shadows[3],
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  selectorContentContainer: {
    flex: 1,
    flexDirection: "row"
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  headerContainer: {
    height: 60,
    backgroundColor: "white",
    ...Shadows[6]
  },
  goBtn: {
    padding: 10,
    borderRadius: 4,
    marginHorizontal: 5
  },
  backIcon: {
    color: colors.black
  },
  completeIcon: {
    color: colors.secondary
  },
  headerStatus: {
    flexDirection: "row",
    alignItems: "center"
  },
  statusInactive: {
    flex: 1 / 5,
    height: 2,
    backgroundColor: colors.lightGrey,
    marginRight: 4
  },
  statusActive: {
    flex: 1 / 5,
    height: 2,
    backgroundColor: colors.secondary,
    marginRight: 4
  }
});

const months = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "dicembre"
];

const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
