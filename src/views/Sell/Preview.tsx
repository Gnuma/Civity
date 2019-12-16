import React, { Component } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import SellTabLayout from "../../components/Sell/SellTabLayout";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { NavigationStackProp } from "react-navigation-stack";
import { StackActions } from "react-navigation";
import * as sellActions from "../../store/sell";
import { StoreType } from "../../store/root";
import update from "immutability-helper";
import { PreviewItem, SellBook } from "../../store/sell/types";
import ImageAdSlider from "../../components/Item/ImageAdSlider";
import {
  imageAdToWidthRatio,
  imageAdMargin
} from "../../components/Item/styles";
import { Header1, Header4, Price, Header3, Text } from "../../components/Text";
import ConditionTag from "../../components/Item/ConditionTag";
import Divider from "../../components/Divider";
import LoadingOverlay from "../../components/LoadingOverlay";
import protectedAction from "../../utils/protectedAction";
import { printAuthors } from "../../utils/helper";
import ItemDetailInfos from "../../components/Item/DetailInfos";
import SellerInfo from "../../components/Item/SellerInfo";
import DetailDescription from "../../components/Item/DetailDescription";
import DetailSecondaryInfos from "../../components/Item/DetailSecondaryInfos";

interface PreviewProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

interface PreviewState {
  data: PreviewItem[];
  state: number;
}

class Preview extends Component<PreviewProps, PreviewState> {
  constructor(props: PreviewProps) {
    super(props);
    this.state = {
      data: props.data,
      state: 0
    };
  }

  continue = () => {
    protectedAction().then(() => {
      this.props.publish().then(res => {
        this.props.navigation.navigate("SellEnd");
        //this.props.navigation.dispatch(StackActions.popToTop());
      });
    });
  };

  render() {
    const { loading } = this.props;
    const { data, state } = this.state;

    if (data.length == 0) return null;

    const books = data.map(item => ({
      ...item.book,
      completed: item.completed
    }));
    const item = data[state];

    const wh = Dimensions.get("window").width;

    const containerMargin =
      (wh * (1 - imageAdToWidthRatio)) / 2 + imageAdMargin;

    return (
      <View style={styles.container}>
        <SellTabLayout
          state={state}
          data={books}
          onContinue={this.complete}
          onGoBack={this.goBack}
          onSwitchTab={this.switchTab}
          onNavigationGoBack={this.navigationGoBack}
          disableConfirm={!this.canComplete()}
          completeText="Pubblica"
        >
          <ImageAdSlider image_ad={item.image_ad} style={styles.imageAdSlide} />
          <View
            style={{
              marginHorizontal: containerMargin
            }}
          >
            <ItemDetailInfos item={item} />
            <Divider />
            <DetailDescription description={item.description} />
            <Divider />
            <DetailSecondaryInfos item={item} />
          </View>
        </SellTabLayout>
        {loading && <LoadingOverlay />}
      </View>
    );
  }

  complete = () => {
    this.continue();
  };

  goBack = () => {
    this.setState(state =>
      update(state, {
        state: { $apply: index => Math.max(0, index - 1) }
      })
    );
  };

  switchTab = (item: SellBook, index: number) => {
    this.setState({
      state: index
    });
  };

  canComplete = () => true;

  navigationGoBack = () => this.props.navigation.goBack(null);
}

interface ReduxStoreProps {
  data: PreviewItem[];
  dataNotValid?: boolean;
  loading?: boolean;
}

const mapStateToProps = (state: StoreType): ReduxStoreProps => {
  let dataNotValid = false;
  const data: PreviewItem[] = [];
  const { items } = state.sell;
  for (let i = 0; i < state.sell.items.length; i++) {
    const item = items[i];
    if (
      item.book != undefined &&
      item.condition != null &&
      item.price != null &&
      item.image_ad.length > 0
    ) {
      data.push({ ...item, completed: true });
    } else return { data: [], dataNotValid: true };
  }
  return {
    data,
    dataNotValid,
    loading: state.sell.loading
  };
};

interface ReduxDispatchProps {
  publish: () => Promise<void>;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): ReduxDispatchProps => ({
  publish: () => dispatch(sellActions.sellStart())
});

export default connect(mapStateToProps, mapDispatchToProps)(Preview);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageAdSlide: {
    marginTop: 20
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },
  price: {
    flex: 1
  },

  userContainer: { marginVertical: 20 },
  usernameContainer: { flexDirection: "row" },
  username: { flex: 1, fontSize: 22, fontWeight: "700", marginBottom: 6 },
  locationContainer: { flexDirection: "row" },
  office: { flex: 1 },
  officeLocation: {},

  descriptionContainer: { marginVertical: 12 },
  description: { fontSize: 18 },
  info: { marginVertical: 12 },
  infoRow: { flexDirection: "row" },
  infoLabel: { flex: 1 }
});
