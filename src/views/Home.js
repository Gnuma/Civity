import React, { Component } from "react";
import {
  StatusBar,
  NativeModules,
  KeyboardAvoidingView,
  View
} from "react-native";
import { withNavigation, StackActions } from "react-navigation";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MainList from "../components/List/MainList";
import SearchResults from "../components/SearchResults/SearchResults";
import * as searchActions from "../store/search";
import BookShelf from "../components/Home/BookShelf";
import SearchLink from "../components/Home/SearchLink";
import { AndroidBackHandler } from "react-navigation-backhandler";
import {
  singleResults,
  multiResults,
  generateResults
} from "../mockData/SearchResults";
import Button from "../components/Button";
import protectedAction from "../utils/protectedAction";
import NotificationCenter from "../components/Home/NotificationCenter";
import _ from "lodash";
import MainHome from "../components/Home/MainHome";
import { GreenBar } from "../components/StatusBars";
import colors from "../styles/colors";
import { IS_ANDROID, KAV_BEHAVIOR } from "../utils/constants";
import IOSToast from "../components/IOSToast";

export class Home extends Component {
  static propTypes = {
    results: PropTypes.array,
    resultType: PropTypes.string,
    isLoadingMore: PropTypes.bool,
    isSearchActive: PropTypes.bool,
    suggestions: PropTypes.array, // take out
    commentsData: PropTypes.object,
    commentsOrder: PropTypes.array,
    searchRedux: PropTypes.func,
    showResults: PropTypes.bool,
    isLoading: PropTypes.bool,
    loadMore: PropTypes.func
  };

  state = {
    containerLayout: null
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("willFocus", () => {
      StatusBar.setBarStyle("light-content");
      IS_ANDROID && StatusBar.setBackgroundColor(colors.darkGreen);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  setContainerLayout = event =>
    this.setState({ containerLayout: event.nativeEvent.layout });

  loadMore = () => {
    if (!this.props.isLast && !this.props.isLoadingMore) this.props.loadMore();
  };

  render() {
    return (
      <AndroidBackHandler onBackPress={this._onBackButtonPressAndroid}>
        <IOSToast>{this.getContent()}</IOSToast>
      </AndroidBackHandler>
    );
  }

  getContent = () => {
    const { results, resultType } = this.props;

    if (this.props.isSearchActive) {
      return (
        <SearchResults
          searchRedux={this.props.searchRedux}
          suggestions={this.props.suggestions}
          searchHistory={this.props.searchHistory}
          searchQuery={this.props.searchQuery}
        />
      );
    } else if (this.props.showResults) {
      return (
        <MainList
          results={results}
          resultType={resultType}
          isLoading={this.props.isLoading}
          loadMore={this.loadMore}
          isLast={this.props.isLast}
        />
        /*<MainList
          data={generateResults(30)}
          isLoading={this.props.isLoading}
          loadMore={this.loadMore
          loadingMore={this.state.loadingMore}
        />*/
      );
    } else {
      return (
        <MainHome
          openSearchBar={this._openSearchBar}
          commentsOrdered={this.props.commentsOrder}
          commentsData={this.props.commentsData}
          goComment={this._onCommentNotificationPress}
          searchOption={this.props.searchRedux}
          setContainerLayout={this.setContainerLayout}
          containerLayout={this.state.containerLayout}
        />
      );
    }
  };

  _onCommentNotificationPress = (itemPK, book) => {
    const pushAction = StackActions.push({
      routeName: "Item",
      params: {
        itemID: itemPK,
        name: book.title,
        authors: book.authors
      }
    });

    this.props.navigation.dispatch(pushAction);
  };

  _onBackButtonPressAndroid = () => {
    if (this.props.isSearchActive) {
      this.props.setActiveRedux(false);
      return true;
    } else if (this.props.showResults) {
      this.props.goHomeRedux();
      return true;
    }
    return false;
  };

  _openSearchBar = () => {
    this.props.setActiveRedux(true);
    //NativeModules.DevMenu.show();
  };
}

const mapStateToProps = state => ({
  isSearchActive: state.search.isActive,
  results: state.search.results,
  resultType: state.search.resultType,
  page: state.search.page,
  isLast: state.search.isLast,
  isLoadingMore: state.search.isLoadingMore,
  suggestions: state.search.suggestions,
  searchHistory: state.search.recent,
  showResults: state.search.showResults,
  searchQuery: state.search.searchQuery,
  isLoading: state.search.loading,
  commentsData: state.comments.data,
  commentsOrder: state.comments.orderedData
});

const mapDispatchToProps = dispatch => {
  return {
    searchRedux: searchOptions => dispatch(searchActions.search(searchOptions)),
    setActiveRedux: isActive =>
      dispatch(searchActions.searchSetActive(isActive)),
    goHomeRedux: () => dispatch(searchActions.searchGoHome()),
    loadMore: () => dispatch(searchActions.searchLoadMore())
  };
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
