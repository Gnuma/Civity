import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as sellActions from "../store/actions/sell";
import axios from "axios";
import BasicHeader from "../components/BasicHeader";
import OutlinedInput from "../components/Form/OutlinedInput";
import SolidButton from "../components/SolidButton";
import { Header3 } from "../components/Text";
import { isNotISBN } from "../utils/validator";
import colors from "../styles/colors";

export class CreateBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
      isbn: props.isbn
    };
  }

  render() {
    const { title, isbn } = this.state;
    const canContinue = title && !isNotISBN(isbn);

    return (
      <View style={{ flex: 1 }}>
        <BasicHeader title="Aggiungi il tuo libro" />
        <View style={{ flex: 1, marginTop: 14 }}>
          <OutlinedInput
            value={title}
            onTextChange={this._handleTitleChange}
            placeholder="Titolo eg: Il Rosso ed il Blu"
          />
          <OutlinedInput
            value={isbn}
            onTextChange={this._handleIsbnChange}
            placeholder="ISBN eg: 937271848"
            inputType="numeric"
          />
          <SolidButton
            style={{
              margin: 20,
              marginTop: 20,
              borderColor: canContinue ? colors.secondary : colors.white,
              borderWidth: 2
            }}
            disabled={!canContinue}
            onPress={this._handleContinue}
          >
            <Header3 color={canContinue ? "primary" : undefined}>
              Avanti
            </Header3>
          </SolidButton>
        </View>
      </View>
    );
  }

  _handleTitleChange = text => {
    this.setState({
      title: text
    });
  };
  _handleIsbnChange = text => {
    this.setState({
      isbn: text
    });
  };
  _handleContinue = () => {
    this.props.createBookRedux(this.state.title, this.state.isbn);
    this.props.navigation.navigate("VendiInfos");
  };
}

const mapStateToProps = state => ({
  title: state.sell.title,
  isbn: state.sell.isbn
});

const mapDispatchToProps = dispatch => ({
  createBookRedux: (title, isbn) =>
    dispatch(sellActions.createBook(title, isbn))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBook);
