import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SBHeader from "../components/Sell/SelectBook/SelectBookHeader";
import { bookList } from "../mockData/Book";
import SBList from "../components/Sell/SelectBook/SelectBookList";
import * as sellActions from "../store/actions/sell";
import axios from "axios";
import { ___BOOK_HINTS_ENDPOINT___ } from "../store/constants";
import _ from "lodash";
import { GreyBar } from "../components/StatusBars";
import { Subject, of } from "rxjs";
import { switchMap, catchError, map } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

export class SelectBook extends Component {
  constructor(props) {
    super(props);
    this.bookQuery = new Subject().pipe(
      switchMap(value =>
        ajax
          .post(___BOOK_HINTS_ENDPOINT___, {
            keyword: value
          })
          .pipe(
            map(res => {
              return res.response;
            }),
            catchError(error => of([]))
          )
      )
    );
  }

  componentDidMount() {
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
      <View style={{ flex: 1 }}>
        <GreyBar />
        <SBHeader
          onChangeText={this.handleChange}
          searchQuery={this.state.searchQuery}
          resetSearchBar={this.resetSearchBar}
          handleGoBack={this.handleGoBack}
        />
        <SBList
          results={this.state.results}
          handleSelection={this.handleSelection}
          hasNoResults={hasNoResults}
          goCreateBook={this._goCreateBook}
          soldBooks={this.state.soldBooks}
        />
      </View>
    );
  }

  /*
  handleChange = text => {
    this.setState({
      searchQuery: text
    });
    if (text) {
      axios
        .post(___BOOK_HINTS_ENDPOINT___, { keyword: text })
        .then(res => {
          this.setState({ results: res.data.results });
        })
        .catch(err => {
          //console.log(err.response);
          this.setState({
            results: []
          });
        });
    }
  };
  */

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
