import React, { Component } from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SalesTab from "../components/Sales/SalesTab";
import * as chatActions from "../store/chat";
import * as sellActions from "../store/sell";
import { Header3, Header2, Header4 } from "../components/Text";
import SalesChatsList from "../components/Sales/SalesChatsList";
import SellButton from "../components/Sales/SellButton";
import _ from "lodash";
import Button from "../components/Button";
import colors from "../styles/colors";
import IconPlus from "../media/vectors/plus-icon";
import { GreyBar } from "../components/StatusBars";
import OfflineView, { OfflineNotification } from "../components/OfflineView";
import { IS_ANDROID, MAX_ADS_FREE_ACCOUNT, UserType } from "../utils/constants";
import { SafeAreaView } from "react-navigation";
import ErrorMessage from "../components/Form/ErrorMessage";
import InfoOverlay from "../components/InfoOverlay";
import Card from "../components/Card";

export class SalesList extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    focus: PropTypes.number,
    setSaleFocus: PropTypes.func,
    startSelling: PropTypes.func,
    data: PropTypes.object,
    orderedData: PropTypes.array
  };

  state = {
    isInfoNumAdsVisible: false
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle(IS_ANDROID ? "light-content" : "dark-content");
      IS_ANDROID && StatusBar.setBackgroundColor(colors.lightGrey);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  dismissInfoNumAds = () => this.setState({ isInfoNumAdsVisible: false });

  renderInfoNumAds = () => {
    const adsCreated =
      MAX_ADS_FREE_ACCOUNT - (this.props.orderedData.length || 0);
    return (
      <Card style={{ margin: 20 }}>
        <Header3 style={{ textAlign: "center" }}>
          Hai a disposizione{" "}
          <Header3 style={{ fontWeight: "bold" }}>
            {adsCreated} su {MAX_ADS_FREE_ACCOUNT}{" "}
          </Header3>
          inserzioni da publicare.
        </Header3>
        <Header3 style={{ textAlign: "center" }}>
          Se desideri pubblicare infinite inserzioni passa a{" "}
          <Header3 style={{ fontWeight: "bold" }}>Civity PRO</Header3>
        </Header3>
      </Card>
    );
  };

  render() {
    const {
      data,
      orderedData,
      focus,
      setSaleFocus,
      isAuthenticated,
      delayedLogin,
      isConnected,
      userData
    } = this.props;

    const adsCreated = MAX_ADS_FREE_ACCOUNT - (orderedData.length || 0);
    const isPro = userData && userData.usertype === UserType.PRO;

    if (delayedLogin) return <OfflineView sales />;

    if (!orderedData || _.isEmpty(orderedData)) return this.renderEmpty();

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <SalesTab
            goTo={setSaleFocus}
            isAuthenticated={isAuthenticated}
            data={data}
            orderedData={orderedData}
            focus={focus}
          />
          <SalesChatsList
            isAuthenticated={isAuthenticated}
            data={data}
            orderedData={orderedData}
            focus={focus}
            onGoChat={this.onGoChat}
          />
          {isConnected && (
            <View
              style={{
                borderTopWidth: 0.5,
                borderColor: colors.divider,
                paddingVertical: 10,
                paddingHorizontal: 20,
                flexDirection: "row"
              }}
            >
              <View style={{ flex: 1 }} />
              <SellButton onPress={this.onGoSell} />
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
                onPress={() => this.setState({ isInfoNumAdsVisible: true })}
              >
                <Header4 style={{ fontWeight: "bold" }}>
                  {isPro
                    ? "Illimitate"
                    : adsCreated + "/" + MAX_ADS_FREE_ACCOUNT}
                </Header4>
                <Header4>Inserzioni rimaste</Header4>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {!isConnected && (
          <View
            style={{ position: "absolute", bottom: 0, left: 20, right: 20 }}
          >
            <OfflineNotification />
          </View>
        )}
        {this.state.isInfoNumAdsVisible && (
          <InfoOverlay dismiss={this.dismissInfoNumAds}>
            {this.renderInfoNumAds()}
          </InfoOverlay>
        )}
      </SafeAreaView>
    );
  }

  onGoSell = () => {
    if (MAX_ADS_FREE_ACCOUNT - (this.props.orderedData.length || 0) > 0)
      this.props.startSelling();
    else this.setState({ isInfoNumAdsVisible: true });
  };

  onGoChat = (itemID, chatID) => {
    this.props.navigation.navigate("SaleChat", {
      itemID,
      chatID
    });
  };

  renderEmpty = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            marginVertical: 20,
            marginHorizontal: 20
          }}
        >
          <Header3 color="black">
            Sembra che tu non abbia ancora creato nessun annuncio...
          </Header3>
          {this.props.isConnected ? (
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <SellButton onPress={this.onGoSell} />
              <Header2 color="primary" style={{ marginTop: 10 }}>
                Inizia ora
              </Header2>
            </View>
          ) : (
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <ErrorMessage error="Non sei connesso ad internet" />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  };
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null,
  focus: state.chat.salesFocus,
  data: state.chat.data,
  orderedData: state.chat.salesOrderedData,
  delayedLogin: state.auth.delayedLogin,
  isConnected: state.settings.isConnected,
  userData: state.auth.userData
});

const mapDispatchToProps = dispatch => ({
  setSaleFocus: focus => dispatch(chatActions.chatSetSalesListFocus(focus)),
  startSelling: () => dispatch(sellActions.sellStartSelling())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesList);
