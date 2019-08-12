import React, { Component } from "react";
import { StatusBar, NativeModules } from "react-native";
import { withNavigation, StackActions } from "react-navigation";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MainList from "../components/List/MainList";
import SearchResults from "../components/SearchResults/SearchResults";
import * as searchActions from "../store/actions/search";
import BookShelf from "../components/Home/BookShelf";
import SearchLink from "../components/Home/SearchLink";
import { AndroidBackHandler } from "react-navigation-backhandler";
import { singleResults, multiResults } from "../mockData/SearchResults";
import Button from "../components/Button";
import protectedAction from "../utils/protectedAction";
import NotificationCenter from "../components/Home/NotificationCenter";
import _ from "lodash";
import MainHome from "../components/Home/MainHome";
import { GreenBar } from "../components/StatusBars";
import colors from "../styles/colors";
import { IS_ANDROID } from "../utils/constants";

export class Home extends Component {
  static propTypes = {
    results: PropTypes.object,
    isSearchActive: PropTypes.bool,
    suggestions: PropTypes.array, // take out
    commentsData: PropTypes.object,
    commentsOrder: PropTypes.array,
    searchRedux: PropTypes.func,
    showResults: PropTypes.bool,
    isLoading: PropTypes.bool
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

  render() {
    return (
      <AndroidBackHandler onBackPress={this._onBackButtonPressAndroid}>
        {this.getContent()}
      </AndroidBackHandler>
    );
  }

  getContent = () => {
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
        <MainList data={this.props.results} isLoading={this.props.isLoading} />
        //<MainList data={singleResults} isLoading={this.props.isLoading} />
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
  suggestions: state.search.suggestions,
  searchHistory: state.search.recent,
  showResults: state.search.showResults,
  searchQuery: state.search.searchQuery,
  isLoading: state.search.loading,
  notifications: state.notifications.notifications, //TAke out
  commentsData: state.comments.data,
  commentsOrder: state.comments.orderedData
});

const mapDispatchToProps = dispatch => {
  return {
    searchRedux: searchOptions => dispatch(searchActions.search(searchOptions)),
    setActiveRedux: isActive =>
      dispatch(searchActions.searchSetActive(isActive)),
    goHomeRedux: () => dispatch(searchActions.searchGoHome())
  };
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
