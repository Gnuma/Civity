import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Image, ScrollView } from "react-native";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { NavigationStackProp } from "react-navigation-stack";
import * as sellActions from "../../store/sell";
import { StoreType } from "../../store/root";
import { GeneralBook, ItemCondition } from "../../types/ItemTypes";
import SellTabLayout from "../../components/Sell/SellTabLayout";
import { generateGeneralInfoItem } from "../../utils/testingHelpers";
import update from "immutability-helper";
import CameraIcon from "../../media/vectors/CameraIcon";
import colors from "../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PictureSelectorItem, SellImage } from "../../store/sell/types";
import { CameraNavigationProps } from "../Camera";
import { Header3 } from "../../components/Text";

interface PicturesSelectorProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
  data: PictureSelectorItem[];
}

interface PicturesSelectorState {
  state: number;
}

class PicturesSelector extends Component<
  PicturesSelectorProps,
  PicturesSelectorState
> {
  constructor(props: PicturesSelectorProps) {
    super(props);

    this.state = {
      state: 0
    };
  }

  openCamera = () => {
    const { state } = this.state;
    const { data } = this.props;
    console.log(data[state]);
    const cameraProps: CameraNavigationProps = {
      book: data[state].book,
      index: state,
      image_ad: data[state].image_ad
    };
    this.props.navigation.navigate("SellCamera", cameraProps);
  };

  continue = () => {
    console.log("Continue");
    this.props.navigation.navigate("SellPreview");
  };

  render() {
    const imageContainerSize = Dimensions.get("window").width / 2;
    const { state } = this.state;
    const { data } = this.props;

    if (data.length == 0) return null;

    const books = data.map(item => ({
      ...item.book
    }));

    return (
      <SellTabLayout
        state={state}
        data={books}
        onContinue={this.complete}
        onGoBack={this.goBack}
        onSwitchTab={this.switchTab}
        onNavigationGoBack={this.navigationGoBack}
        disableConfirm={!this.canComplete()}
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              height:
                Math.ceil((data[state].image_ad.length + 1) / 2) *
                imageContainerSize
            }}
          >
            <TouchableOpacity onPress={this.openCamera}>
              <View
                style={{
                  width: imageContainerSize,
                  height: imageContainerSize
                }}
              >
                <View style={styles.cameraButton}>
                  <CameraIcon size={40} color={colors.lightGrey} />
                </View>
              </View>
            </TouchableOpacity>
            {data[state].image_ad.map((image, index) => {
              const offset = {
                x: index % 2 === 0 ? imageContainerSize : 0,
                y: Math.ceil(index / 2) * imageContainerSize
              };
              return (
                <ImagePreview
                  key={index}
                  source={image}
                  imageContainerSize={imageContainerSize}
                  offset={offset}
                />
              );
            })}
          </ScrollView>
        </View>
      </SellTabLayout>
    );
  }

  complete = () => {
    this.setState(
      state =>
        update(state, {
          state: {
            $apply: bookIndex => incrementIndex(this.props.data, bookIndex)
          }
        }),
      () => {
        let canContinue = true;
        this.props.data.forEach(
          item => (canContinue = !!(canContinue && item.image_ad.length))
        );
        if (canContinue) this.continue();
      }
    );
  };

  goBack = () => {
    this.setState(state =>
      update(state, {
        state: {
          $apply: bookIndex => decrementIndex(this.props.data, bookIndex)
        }
      })
    );
  };

  switchTab = (item: GeneralBook, index: number) => {
    this.setState({
      state: index
    });
  };

  canComplete = () => !!this.props.data[this.state.state].image_ad.length;

  navigationGoBack = () => this.props.navigation.goBack(null);
}

interface ReduxStoreProps {
  data: PictureSelectorItem[];
}

const mapStateToProps = (state: StoreType): ReduxStoreProps => ({
  data: state.sell.items.reduce(
    (itemsData: PictureSelectorItem[], { book, ...rest }) => {
      if (book)
        itemsData.push({
          book: book,
          ...rest
        });
      return itemsData;
    },
    []
  )
});

interface ReduxDispatchProps {}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): ReduxDispatchProps => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PicturesSelector);

const SQUARE_MARGIN = 6;

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    position: "absolute"
  },
  cameraButton: {
    flex: 1,
    margin: SQUARE_MARGIN,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.lightGrey,
    borderStyle: "dashed"
  },
  image: {
    position: "absolute",
    margin: SQUARE_MARGIN,
    borderRadius: 10
  }
});

const incrementIndex = (
  data: PictureSelectorItem[],
  bookIndex: number
): number => {
  const left = data.slice(0, bookIndex).findIndex(item => item.image_ad.length);
  const right = data
    .slice(bookIndex + 1)
    .findIndex(item => !item.image_ad.length);
  console.log();
  if (right != -1) return right + bookIndex + 1;
  if (left != -1) return left;
  return bookIndex;
};

const decrementIndex = (
  data: PictureSelectorItem[],
  bookIndex: number
): number => {
  if (bookIndex === 0) return 0;
  const left = data
    .slice(0, bookIndex)
    .findIndex(item => !item.image_ad.length);
  const right = data
    .slice(bookIndex + 1)
    .findIndex(item => !item.image_ad.length);
  data.slice(0, bookIndex).findIndex(item => {
    return item.image_ad.length;
  });
  if (left != -1) return left;
  else if (right != -1) return right + bookIndex + 1;
  else return Math.max(0, bookIndex - 1);
};

interface ImagePreviewProps {
  source: SellImage;
  imageContainerSize: number;
  offset: { x: number; y: number };
}
const ImagePreview = ({
  source,
  imageContainerSize,
  offset
}: ImagePreviewProps) => {
  return (
    <Image
      source={{ uri: source.uri }}
      style={[
        styles.image,
        {
          transform: [{ translateX: offset.x }, { translateY: offset.y }],
          width: imageContainerSize - SQUARE_MARGIN * 2,
          height: imageContainerSize - SQUARE_MARGIN * 2
        }
      ]}
    />
  );
};
