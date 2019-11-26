import React, { Component } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
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
import { PictureSelectorItem } from "../../store/sell/types";
import { CameraNavigationProps } from "../Camera";

interface PicturesSelectorProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

interface PicturesSelectorState {
  data: PictureSelectorItem[];
  state: number;
}

class PicturesSelector extends Component<
  PicturesSelectorProps,
  PicturesSelectorState
> {
  state = {
    data: generateGeneralInfoItem(2),
    state: 0
  };

  openCamera = () => {
    const { state, data } = this.state;
    const cameraProps: CameraNavigationProps = {
      book: data[state].book,
      index: state,
      image_ad: data[state].image_ad
    };
    this.props.navigation.navigate("SellCamera", cameraProps);
  };

  continue = () => {
    this.props.navigation.navigate("PhotosList");
  };

  render() {
    const imageContainerSize =
      Dimensions.get("window").width / 2 - SQUARE_MARGIN * 2;
    const { data, state } = this.state;
    const books = data.map(item => ({
      ...item.book,
      completed: item.completed
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
          <TouchableOpacity onPress={this.openCamera}>
            <View
              style={[
                styles.cameraButton,
                { width: imageContainerSize, height: imageContainerSize }
              ]}
            >
              <CameraIcon size={40} color={colors.lightGrey} />
            </View>
          </TouchableOpacity>
        </View>
      </SellTabLayout>
    );
  }

  complete = () => {
    this.setState(
      state =>
        update(state, {
          data: {
            [state.state]: {
              completed: { $set: true }
            }
          },
          state: {
            $apply: bookIndex => incrementIndex(state, bookIndex)
          }
        }),
      () => {
        let canContinue = true;
        this.state.data.forEach(
          item => (canContinue = !!(canContinue && item.completed))
        );
        if (canContinue) this.continue();
      }
    );
  };

  goBack = () => {
    this.setState(state =>
      update(state, {
        state: {
          $apply: bookIndex => decrementIndex(state, bookIndex)
        }
      })
    );
  };

  switchTab = (item: GeneralBook, index: number) => {
    this.setState({
      state: index
    });
  };

  canComplete = () =>
    !!(
      this.state.data[this.state.state].price != null &&
      this.state.data[this.state.state].condition != null
    );

  navigationGoBack = () => this.props.navigation.goBack(null);
}

interface ReduxStoreProps {
  itemsData: PictureSelectorItem[];
}

const mapStateToProps = (state: StoreType): ReduxStoreProps => ({
  itemsData: state.sell.items.reduce(
    (itemsData: PictureSelectorItem[], { book, ...rest }) => {
      if (book)
        itemsData.push({
          book: book,
          ...rest,
          completed: !!(rest.image_ad && rest.image_ad.length > 0)
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

const SQUARE_MARGIN = 10;

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  cameraButton: {
    marginLeft: SQUARE_MARGIN,
    marginTop: SQUARE_MARGIN,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.lightGrey,
    borderStyle: "dashed"
  }
});

const incrementIndex = (
  state: PicturesSelectorState,
  bookIndex: number
): number => {
  const right = state.data
    .slice(bookIndex + 1)
    .findIndex(item => !item.completed);
  const left = state.data
    .slice(0, bookIndex)
    .findIndex(item => !item.completed);
  if (right != -1) return right + bookIndex + 1;
  if (left != -1) return left;
  return bookIndex;
};

const decrementIndex = (
  state: PicturesSelectorState,
  bookIndex: number
): number => {
  const left = state.data
    .slice(0, bookIndex)
    .findIndex(item => !item.completed);
  const right = state.data
    .slice(bookIndex + 1)
    .findIndex(item => !item.completed);
  if (left != -1) return left;
  else if (right != -1) return right + bookIndex + 1;
  else return Math.max(0, bookIndex - 1);
};
