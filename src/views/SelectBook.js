import React, { Component } from "react";
import { View, Text, KeyboardAvoidingView } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SBHeader from "../components/Sell/SelectBook/SelectBookHeader";
import { bookList } from "../mockData/Book";
import SBList from "../components/Sell/SelectBook/SelectBookList";
import * as sellActions from "../store/sell";
import axios from "axios";
import { ___BOOK_HINTS_ENDPOINT___ } from "../store/endpoints";
import _ from "lodash";
import { GreyBar, setGreyBar } from "../components/StatusBars";
import { Subject, of } from "rxjs";
import { switchMap, catchError, map } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { Header3 } from "../components/Text";
import { SafeAreaView } from "react-navigation";
import { KAV_BEHAVIOR } from "../utils/constants";

export class SelectBook extends Component {
  constructor(props) {
    super(props);
    this.bookQuery = new Subject().pipe(
      switchMap(value => {
        this.setState({ loading: true });
        return ajax
          .post(___BOOK_HINTS_ENDPOINT___, {
            keyword: value
          })
          .pipe(
            map(res => {
              this.setState({ loading: false });
              return res.response;
            }),
            catchError(error => {
              this.setState({ loading: false });
              of(error);
            })
          );
      })
    );
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener(
      "willFocus",
      setGreyBar
    );
    setGreyBar();

    this.querySubscription = this.bookQuery.subscribe({
      next: results => {
        console.log(results);
        this.setState({ results });
      },
      error: err => {
        console.log(err);
        this.setState({
          results: []
        });
      }
    });

    const soldBooks = {};
    for (let i = 0; i < this.props.sales.length; i++) {
      soldBooks[
        this.props.chatData[this.props.sales[i].itemID].book.isbn
      ] = true;
    }
    this.setState({
      soldBooks
    });
  }

  componentWillUnmount() {
    this.querySubscription && this.querySubscription.unsubscribe();
    this._navListener.remove();
  }

  state = {
    searchQuery: "",
    results: [],
    soldBooks: {}
  };

  render() {
    const hasNoResults =
      _.isEmpty(this.state.results) && this.state.searchQuery;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <GreyBar />
          <SBHeader
            onChangeText={this.handleChange}
            searchQuery={this.state.searchQuery}
            resetSearchBar={this.resetSearchBar}
            handleGoBack={this.handleGoBack}
          />
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={KAV_BEHAVIOR}>
            <SBList
              results={this.state.results}
              handleSelection={this.handleSelection}
              hasNoResults={hasNoResults}
              goCreateBook={this._goCreateBook}
              soldBooks={this.state.soldBooks}
              loading={this.state.loading}
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }

  handleChange = text => {
    this.setState({
      searchQuery: text
    });
    this.bookQuery.next(text);
  };

  _goCreateBook = () => {
    this.props.navigation.navigate("CreateBook");

    /*
    //TEST
    this.props.selectBookRedux({
      isbn: 9788808831538,
      title: "FAKE Matematica Verde 4",
      authors: "FAKE MARIO"
    });
    this.props.navigation.navigate("VendiInfos");
    //TEST
    */
  };

  resetSearchBar = () => this.handleChange("");

  handleSelection = book => {
    this.props.selectBookRedux(book);
    this.props.navigation.navigate("VendiInfos");
  };

  handleGoBack = () => {
    this.props.navigation.goBack(null);
  };
}

const mapStateToProps = state => ({
  chatData: state.chat.data,
  sales: state.chat.salesOrderedData
});

const mapDispatchToProps = dispatch => {
  return {
    selectBookRedux: book => dispatch(sellActions.selectBook(book))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectBook);
