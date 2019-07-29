import React, { Component } from "react";
import { View, Text, StatusBar } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SalesTab from "../components/Sales/SalesTab";
import * as chatActions from "../store/actions/chat";
import * as sellActions from "../store/actions/sell";
import { Header3, Header2 } from "../components/Text";
import SalesChatsList from "../components/Sales/SalesChatsList";
import SellButton from "../components/Sales/SellButton";
import _ from "lodash";
import Button from "../components/Button";
import colors from "../styles/colors";
import IconPlus from "../media/vectors/plus-icon";
import { GreyBar } from "../components/StatusBars";
import OfflineView, { OfflineNotification } from "../components/OfflineView";

export class SalesList extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    focus: PropTypes.number,
    setSaleFocus: PropTypes.func,
    startSelling: PropTypes.func,
    data: PropTypes.object,
    orderedData: PropTypes.array
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBackgroundColor(colors.lightGrey);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  render() {
    const {
      data,
      orderedData,
      focus,
      setSaleFocus,
      isAuthenticated,
      delayedLogin,
      isConnected
    } = this.props;

    if (delayedLogin) return <OfflineView sales />;

    return (
      <View style={{ flex: 1 }}>
        {!orderedData || _.isEmpty(orderedData) ? (
          this.renderEmpty()
        ) : (
          <View style={{ flex: 1 }}>
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
            {isConnected && <SellButton onPress={this.onGoSell} />}
          </View>
        )}
        {!isConnected && (
          <View
            style={{ position: "absolute", bottom: 0, left: 20, right: 20 }}
          >
            <OfflineNotification />
          </View>
        )}
      </View>
    );
  }

  onGoSell = () => {
    this.props.startSelling();
  };

  onGoChat = (itemID, chatID) => {
    this.props.navigation.navigate("SaleChat", {
      itemID,
      chatID
    });
  };

  renderEmpty = () => {
    return (
      <View style={{ flex: 1, marginHorizontal: 20, marginVertical: 20 }}>
        <Header3 color="black">
          Sembra che tu non abbia ancora creato nessun annuncio...
        </Header3>
        {this.props.isConnected && (
          <View>
            <Button
              style={{
                backgroundColor: colors.white,
                elevation: 2,
                borderRadius: 8,
                alignSelf: "center",
                padding: 6,
                marginTop: 30
              }}
              onPress={this.onGoSell}
            >
              <IconPlus />
            </Button>
            <Header2
              color="primary"
              style={{ marginTop: 10, alignSelf: "center" }}
            >
              Inizia ora
            </Header2>
          </View>
        )}
      </View>
    );
  };
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null,
  focus: state.chat.salesFocus,
  data: state.chat.data,
  orderedData: state.chat.salesOrderedData,
  delayedLogin: state.auth.delayedLogin,
  isConnected: state.settings.isConnected
});

const mapDispatchToProps = dispatch => ({
  setSaleFocus: focus => dispatch(chatActions.chatSetSalesListFocus(focus)),
  startSelling: () => dispatch(sellActions.sellStartSelling())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesList);
