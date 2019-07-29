import React, { Component } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ItemHeader from "../components/Item/ItemHeader";
import MainSell from "../components/Sell/MainSell";
import * as sellActions from "../store/actions/sell";
import colors from "../styles/colors";
import protectedAction from "../utils/protectedAction";
import { GreyBar } from "../components/StatusBars";

export class VendiInfos extends Component {
  state = {
    price: "",
    conditions: -1,
    description: ""
  };

  render() {
    const {
      price,
      conditions,
      description,
      setPriceRedux,
      setDescriptionRedux,
      setConditionsRedux,
      loading,
      book
    } = this.props;
    const { title, authors } = book || { title: "UNDEFINED" };

    return (
      <View style={{ flex: 1 }}>
        <GreyBar />
        <ItemHeader
          handleGoBack={this._handleGoBack}
          title={title}
          authors={authors}
        />
        {!loading ? (
          <MainSell
            price={price}
            conditions={conditions}
            description={description}
            setPrice={setPriceRedux}
            setDescription={setDescriptionRedux}
            setConditions={setConditionsRedux}
            handleComplete={this._handleComplete}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={colors.secondary} />
          </View>
        )}
      </View>
    );
  }

  _handleGoBack = () => {
    this.props.navigation.goBack(null);
  };

  _handleComplete = () => {
    if (
      this.props.price &&
      this.props.description &&
      this.props.conditions !== undefined
    ) {
      protectedAction()
        .then(() => {
          this.props.navigation.navigate("PreviewItem");
        })
        .catch(() => console.log("Need to be logged in"));
    }
  };
}

const mapStateToProps = state => ({
  price: state.sell.price,
  description: state.sell.description,
  conditions: state.sell.conditions,
  loading: state.sell.loading,
  book: state.sell.book
});

const mapDispatchToProps = dispatch => {
  return {
    setPriceRedux: price => dispatch(sellActions.setPrice(price)),
    setDescriptionRedux: description =>
      dispatch(sellActions.setDescription(description)),
    setConditionsRedux: conditions =>
      dispatch(sellActions.setConditions(conditions)),
    submitRedux: () => dispatch(sellActions.submit())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VendiInfos);
