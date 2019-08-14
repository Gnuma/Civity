import React, { Component } from "react";
import { View, Text, ScrollView, Keyboard, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as sellActions from "../store/actions/sell";
import axios from "axios";
import BasicHeader from "../components/BasicHeader";
import { Header3, Header4 } from "../components/Text";
import { isNotISBN, isEmpty, submit } from "../utils/validator";
import colors from "../styles/colors";
import FullButton from "../components/FullButton";
import LabeledInput from "../components/Form/LabeledInput";
import Divider from "../components/Divider";
import update from "immutability-helper";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  ___CREATE_BOOK___,
  ___SUBJECT_HINTS_ENDPOINT___
} from "../store/constants";
import { GreyBar, setGreyBar } from "../components/StatusBars";
import { SafeAreaView } from "react-navigation";
import Picker from "../components/TextInputPicker";
import { Subject, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { switchMap, map, catchError } from "rxjs/operators";
import protectedAction from "../utils/protectedAction";

export class CreateBook extends Component {
  constructor(props) {
    super(props);

    this.subjectQuery = createQuerySubject();

    this.state = {
      fields: {
        isbn: { value: "", errorMessage: "" },
        title: { value: "", errorMessage: "" },
        author: { value: "", errorMessage: "" },
        subject: { value: "", errorMessage: "" }
      },
      loading: false,
      subjectOptions: []
    };
  }

  componentDidMount() {
    this.subjectQuerySubscription = this.subjectQuery.subscribe({
      next: options => this.setState({ subjectOptions: options }),
      error: err => {
        console.log(err);
        this.setState({ officeOptions: [] });
      }
    });
    this._navListener = this.props.navigation.addListener(
      "willFocus",
      setGreyBar
    );
    setGreyBar();
  }

  componentWillUnmount() {
    this.subjectQuerySubscription &&
      this.subjectQuerySubscription.unsubscribe();
    this._navListener.remove();
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

  onSubjectChange = text => {
    this.subjectQuery.next(text);
    this.setState(state =>
      update(state, {
        fields: {
          subject: {
            value: { $set: text }
          }
        }
      })
    );
  };

  onSubjectSelect = item => {
    this.setState(state =>
      update(state, {
        fields: {
          subject: {
            value: { $set: item.title ? item.title : item }
          }
        }
      })
    );
  };

  render() {
    const { fields, loading, subjectOptions } = this.state;
    const fullSubjectOptions = fields.subject.value
      ? update(subjectOptions, {
          $unshift: [fields.subject.value]
        })
      : subjectOptions;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <GreyBar />
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
                <Header4
                  color="black"
                  style={{ marginLeft: 20 }}
                  numberOfLines={1}
                >
                  Materia
                </Header4>
                <Picker
                  placeholder={"Materia"}
                  options={fullSubjectOptions}
                  value={fields.subject.value}
                  onTextChange={this.onSubjectChange}
                  renderOption={this.renderSubject}
                  onSelect={this.onSubjectSelect}
                />
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
      </SafeAreaView>
    );
  }

  canContinue = () =>
    this.state.fields.isbn.value &&
    this.state.fields.title.value &&
    this.state.fields.subject.value;

  continue = async () => {
    Keyboard.dismiss();
    protectedAction().then(async () => {
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
        const subject = fields.subject.value;

        axios
          .post(___CREATE_BOOK___, {
            isbn,
            title,
            author: author || undefined,
            subject: subject
          })
          .then(res => {
            console.log(res);
            this.setState({
              loading: false
            });
            this.props.selectBook(res.data);
            this.props.navigation.navigate("VendiInfos");
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
    });
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
    },
    subject: {
      functions: [isEmpty],
      warnings: ["Inserisci la materia di appartenenza"]
    }
  };

  renderSubject = item => {
    return (
      <Header3 color={"black"} style={{ margin: 10 }}>
        {item.title || '"' + item + '"'}
      </Header3>
    );
  };
}

const mapStateToProps = state => ({
  title: state.sell.title,
  isbn: state.sell.isbn
});

const mapDispatchToProps = dispatch => ({
  createBookRedux: (title, isbn) =>
    dispatch(sellActions.createBook(title, isbn)),
  selectBook: book => dispatch(sellActions.selectBook(book))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBook);

const createQuerySubject = () =>
  new Subject().pipe(
    switchMap(value =>
      ajax
        .post(___SUBJECT_HINTS_ENDPOINT___, {
          keyword: value
        })
        .pipe(
          map(res => {
            console.log(res);
            return res.response;
          }),
          catchError(error => {
            console.log(error);
            return of([]);
          })
        )
    )
  );
