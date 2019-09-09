import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ItemHeader from "../components/Item/ItemHeader";
import MainSell from "../components/Sell/MainSell";
import * as sellActions from "../store/actions/sell";
import colors from "../styles/colors";
import protectedAction from "../utils/protectedAction";
import { GreyBar } from "../components/StatusBars";
import { SafeAreaView } from "react-navigation";
import { KAV_BEHAVIOR } from "../utils/constants";
import update from "immutability-helper";
import { submit, isEmpty, isUndefined } from "../utils/validator";

export class VendiInfos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        price: { value: props.price, errorMessage: "" },
        conditions: { value: props.conditions, errorMessage: "" },
        description: { value: props.description, errorMessage: "" }
      },
      error: ""
    };
  }

  setInfoField = (key, value) =>
    this.setState(state =>
      update(state, {
        fields: {
          [key]: { value: { $set: value } }
        }
      })
    );

  render() {
    const { loading, book } = this.props;
    const {
      fields: { price, conditions, description },
      error
    } = this.state;
    const { title, author } = book || { title: "UNDEFINED" };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1, overflow: "hidden" }}
          behavior={KAV_BEHAVIOR}
        >
          <GreyBar />
          <ItemHeader
            handleGoBack={this._handleGoBack}
            title={title}
            author={author}
          />
          {!loading ? (
            <MainSell
              price={price}
              conditions={conditions}
              description={description}
              setField={this.setInfoField}
              handleComplete={this._handleComplete}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <ActivityIndicator size="large" color={colors.secondary} />
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  _handleGoBack = () => {
    const {
      price: { value: price },
      conditions: { value: conditions },
      description: { value: description }
    } = this.state.fields;
    this.props.sellSetInfos({ price, conditions, description });
    this.props.navigation.goBack(null);
  };

  _handleComplete = async () => {
    const result = await submit(this.state.fields, this.validators);
    if (result === true) {
      const {
        price: { value: price },
        conditions: { value: conditions },
        description: { value: description }
      } = this.state.fields;
      this.props.sellSetInfos({ price, conditions, description });
      protectedAction()
        .then(() => {
          this.props.navigation.navigate("PreviewItem");
        })
        .catch(() => console.log("Need to be logged in"));
    } else {
      this.setState({ fields: result });
    }
  };

  validators = {
    price: {
      functions: [isEmpty, isNegative],
      warnings: [
        "Inserisci il prezzo del libro",
        "Il prezzo deve essere un numero positivo"
      ]
    },
    conditions: {
      functions: [isUndefined],
      warnings: ["Inserisci le condizioni del libro"]
    },
    description: {
      functions: [isEmpty, descriptionLengthValidator],
      warnings: [
        "Inserisci una piccola descrizione",
        "La descrizione deve essere compresa tra i 16 e i 280 caratteri"
      ]
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
    sellSetInfos: infos => dispatch(sellActions.sellSetInfos(infos))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VendiInfos);

const isNegative = n => n <= 0;
const descriptionLengthValidator = str => str.length < 16 || str.length > 280;
