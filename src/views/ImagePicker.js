import React, { Component, PureComponent } from "react";
import {
  View,
  CameraRoll,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  FlatList,
  ToastAndroid,
  PermissionsAndroid,
  StatusBar
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GreyBar } from "../components/StatusBars";
import BasicHeader from "../components/BasicHeader";
import colors from "../styles/colors";
import { ___BOOK_IMG_RATIO___ } from "../utils/constants";
import update, { extend } from "immutability-helper";
import { Header3, Header1, Header2 } from "../components/Text";
import FastImage from "react-native-fast-image";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import Button from "../components/Button";
import _ from "lodash";
import Icon from "react-native-vector-icons/FontAwesome";
import * as sellActions from "../store/actions/sell";

const BATCH_SIZE = 99;

export class ImagePicker extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      hasMore: true,
      selected: [],
      numSelected: 0,
      hasPermission: undefined
    };

    this.retrieveIndex = undefined;
    this.loading = false;
  }

  componentDidMount() {
    this.requestPermissions();
  }

  retrieveImages = numImages => {
    this.loading = true;
    CameraRoll.getPhotos({
      first: numImages,
      after: this.retrieveIndex
    })
      .then(res => {
        this.retrieveIndex = res.page_info.end_cursor;
        this.setState({
          hasMore: res.page_info.has_next_page
        });
        let data = this.state.data;
        let dataIndex = data.length - 1;
        if (res.edges.length > 0) {
          if (dataIndex === -1) {
            data = update(data, {
              $push: [
                {
                  title: new Date(res.edges[0].node.timestamp * 1000),
                  data: [],
                  sectionID: 0
                }
              ]
            });
            dataIndex++;
          }
        }
        for (let i = 0; i < res.edges.length; i++) {
          const node = res.edges[i].node;
          console.log(node);
          const day = new Date(node.timestamp * 1000);
          if (day.getDay() !== data[dataIndex].title.getDay()) {
            data = update(data, {
              $push: [
                {
                  title: day,
                  data: [node],
                  sectionID: dataIndex + 1
                }
              ]
            });
            dataIndex++;
          } else {
            data = update(data, {
              [dataIndex]: {
                data: { $push: [node] }
              }
            });
          }
        }
        this.setState(
          {
            data
          },
          () => (this.loading = false)
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  togleImg = (sectionID, index) => {
    this.setState(prevState =>
      update(prevState, {
        selected: {
          [sectionID]: section =>
            update(section || {}, {
              [index]: state =>
                update(state || false, {
                  $apply: oldStatus => {
                    if (!oldStatus) {
                      if (prevState.numSelected < 5) {
                        prevState.numSelected++;
                        return true;
                      } else {
                        ToastAndroid.show(
                          "Numero di foto massimo raggiunto",
                          ToastAndroid.SHORT
                        );
                        return false;
                      }
                    } else {
                      prevState.numSelected--;
                      return false;
                    }
                  }
                })
            })
        }
      })
    );
  };

  complete = () => {
    let data = [];
    for (const sectionID in this.state.selected) {
      if (this.state.selected.hasOwnProperty(sectionID)) {
        const section = this.state.selected[sectionID];
        for (const itemID in section) {
          if (section.hasOwnProperty(itemID)) {
            if (section[itemID])
              data.push(this.state.data[sectionID].data[itemID].image);
          }
        }
      }
    }
    this.props.addReview(data);
    this.exitPicker();
  };

  exitPicker = () => this.props.navigation.goBack(null);

  renderItem = ({ index, section }) => {
    return (
      <ListRow
        index={index}
        section={section}
        toggle={this.togleImg}
        selected={this.state.selected[section.sectionID] || {}}
      />
    );
  };

  renderHeader = ({ section: { title } }) => {
    return (
      <View
        style={{
          marginVertical: 4,
          paddingVertical: 6,
          borderBottomColor: colors.lightGrey,
          borderBottomWidth: 0.5
        }}
      >
        <Header2
          color="black"
          style={{
            marginLeft: 25
          }}
        >
          {days[title.getDay()] +
            " " +
            title.getDate() +
            " " +
            months[title.getMonth()]}
        </Header2>
      </View>
    );
  };

  render() {
    const { data, numSelected, hasPermission } = this.state;
    //console.log(data);
    if (hasPermission === undefined) {
      return null;
    }

    return (
      <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
        <PickerHeader
          complete={this.complete}
          goBack={this.exitPicker}
          numSelected={numSelected}
        />
        {hasPermission ? (
          <View style={{ flex: 1 }}>
            <SectionList
              sections={data}
              renderItem={this.renderItem}
              renderSectionHeader={this.renderHeader}
              keyExtractor={this.keyExtractor}
              onEndReached={() => {
                this.state.hasMore &&
                  !this.loading &&
                  this.retrieveImages(BATCH_SIZE);
              }}
              onEndReachedThreshold={0.5}
              //initialNumToRender={50}
              ListFooterComponent={this.renderFooter}
            />
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Header3 color="black">
              Per accedere alle immagini abbiamo bisogno del tuo permesso
            </Header3>
          </View>
        )}
      </View>
    );
  }

  keyExtractor = (item, index) => {
    return index.toString();
  };

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

class ListRow extends Component {
  shouldComponentUpdate(nextProps) {
    const { section, selected } = this.props;
    return (
      section.length !== nextProps.length ||
      !_.isEqual(selected, nextProps.selected)
    );
  }
  render() {
    const { index, section, toggle, selected } = this.props;
    //console.log("updating", selected);
    const numColumns = 3;
    if (index % numColumns !== 0) return null;
    const items = [];
    for (let i = index; i < index + numColumns; i++) {
      if (i >= section.data.length) break;
      items.push(
        <ImageRoll
          item={section.data[i]}
          key={i.toString()}
          id={i}
          toggle={toggle}
          active={!!selected[i]}
          sectionID={section.sectionID}
        />
      );
    }
    return <View style={styles.row}>{items}</View>;
  }
}

class ImageRoll extends PureComponent {
  render() {
    //console.log("rendering Item");
    const { item, toggle, id, active, sectionID } = this.props;
    return (
      <View style={[styles.item]}>
        <TouchableNativeFeedback
          style={styles.itemBtn}
          onPress={() => toggle(sectionID, id)}
        >
          <View style={{ flex: 1 }}>
            <FastImage
              style={StyleSheet.absoluteFill}
              source={{ uri: item.image.uri }}
            />
            {active && (
              <View style={[styles.overlay]}>
                <Icon name="check" size={24} style={styles.overlayIcon} />
              </View>
            )}
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

class PickerHeader extends PureComponent {
  render() {
    const { numSelected } = this.props;
    let statusBar = [];
    for (let i = 0; i < 5; i++) {
      statusBar.push(
        <View
          key={i}
          style={[
            i < numSelected ? styles.statusActive : styles.statusInactive,
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

const margin = 10;

const { width: screenWidth } = Dimensions.get("screen");
const itemWidth = (screenWidth - margin * 4.2) / 3;
const itemHeight = itemWidth;

const styles = StyleSheet.create({
  item: {
    width: itemWidth,
    height: itemHeight,
    elevation: 2,
    backgroundColor: colors.white,
    borderRadius: 6,
    overflow: "hidden",
    marginLeft: margin
  },
  itemBtn: {
    width: itemWidth,
    height: itemHeight
  },
  row: {
    marginTop: 10,
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
    elevation: 3,
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
    elevation: 6
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
