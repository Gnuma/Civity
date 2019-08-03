import React, { Component } from "react";
import { View, Text, ScrollView, Keyboard, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as sellActions from "../store/actions/sell";
import axios from "axios";
import BasicHeader from "../components/BasicHeader";
import { Header3 } from "../components/Text";
import { isNotISBN, isEmpty, submit } from "../utils/validator";
import colors from "../styles/colors";
import FullButton from "../components/FullButton";
import LabeledInput from "../components/Form/LabeledInput";
import Divider from "../components/Divider";
import update from "immutability-helper";
import LoadingOverlay from "../components/LoadingOverlay";
import { ___CREATE_BOOK___ } from "../store/constants";

export class CreateBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {
        isbn: { value: "", errorMessage: "" },
        title: { value: "", errorMessage: "" },
        author: { value: "", errorMessage: "" }
      },
      loading: false
    };
  }

  updateField = (key, value) => {
    this.setState(prevState =>
      update(prevState, {
        fields: {
          [key]: { $set: { value, errorMessage: "" } }
        }
      })
    );
  };

  render() {
    const { fields, loading } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <BasicHeader title="Aggiungi il  libro" />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
            <ScrollView>
              <LabeledInput
                placeholder={"ISBN"}
                state={fields.isbn}
                onTextChange={text => this.updateField("isbn", text)}
              />
              <Divider style={{ marginVertical: 10 }} />
              <LabeledInput
                placeholder={"Nome"}
                state={fields.title}
                onTextChange={text => this.updateField("title", text)}
              />
              <LabeledInput
                placeholder={"Autori"}
                state={fields.author}
                onTextChange={text => this.updateField("author", text)}
              />
              <Divider style={{ marginVertical: 10 }} />
              <Header3>Coming soon...</Header3>
            </ScrollView>
          </View>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20
            }}
          >
            <FullButton
              onPress={this.continue}
              value="Aggiungi"
              icon="pen"
              contentStyle={{
                flex: 1,
                textAlign: "center"
              }}
              disabled={!this.canContinue()}
            />
          </View>
          {loading && (
            <View style={{ ...StyleSheet.absoluteFill, elevation: 10 }}>
              <LoadingOverlay />
            </View>
          )}
        </View>
      </View>
    );
  }

  canContinue = () =>
    this.state.fields.isbn.value && this.state.fields.title.value;

  continue = async () => {
    Keyboard.dismiss();
    this.setState({
      loading: true
    });
    const { author: authorField, ...fields } = this.state.fields;
    const result = await submit(fields, this.validators);
    console.log(fields, this.validators);
    if (result == true) {
      const isbn = fields.isbn.value;
      const title = fields.title.value;
      const author = authorField.value;

      axios
        .post(___CREATE_BOOK___, {
          isbn,
          title,
          author,
          subject: 1 //To change
        })
        .then(res => {
          console.log(res);
          this.setState({
            loading: false
          });
          this.props.navigation.goBack(null);
        })
        .catch(err => {
          console.log({ err });
          this.setState({
            loading: false
          });
        });
    } else {
      this.setState(state =>
        update(state, {
          fields: { $merge: fields },
          loading: { $set: false }
        })
      );
    }
  };

  validators = {
    isbn: {
      functions: [isEmpty, isNotISBN],
      warnings: [
        "Inserisci l'isbn",
        "Il codice inserito non sembra un codice ISBN"
      ]
    },
    title: {
      functions: [isEmpty],
      warnings: ["Inserisci il titolo"]
    }
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
