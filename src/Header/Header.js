import React, { Component } from "react";
import { View, Keyboard } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withNavigation, SafeAreaView } from "react-navigation";
import styles from "./styles";
import * as searchActions from "../store/actions/search";
import * as authActions from "../store/actions/auth";
import LeftHeader from "./LeftHeader";
import CenterHeader from "./CenterHeader";
import RightHeader from "./RightHeader";
import NavigationService from "../navigator/NavigationService";
import protectedAction from "../utils/protectedAction";
import SearchHeader from "./SearchHeader";
import HomeHeader from "./HomeHeader";

export class Header extends Component {
  static propTypes = {
    searchRedux: PropTypes.func,
    setActiveRedux: PropTypes.func,
    searchQuery: PropTypes.string,
    isActive: PropTypes.bool,
    handleSearchQueryChange: PropTypes.func,
    showResults: PropTypes.bool
  };

  componentDidUpdate = prevProps => {
    if (!prevProps.isActive && this.props.isActive)
      this.searchField && this.searchField.focus();
  };

  setSearchRef = input => {
    this.searchField = input;
  };

  handleChangeText = searchQuery => {
    this.props.handleSearchQueryChange(searchQuery);
  };

  resetToHome = () => {
    Keyboard.dismiss();
    this.props.goHomeRedux();
  };

  search = () => {
    if (this.props.searchQuery)
      this.props.searchRedux({ keyword: this.props.searchQuery });
    else this.resetToHome();
  };

  setActive = () => {
    this.props.setActiveRedux(true);
  };

  clearSearchQuery = () => {
    this.searchField && this.searchField.focus();
    this.props.handleSearchQueryChange("");
  };

  //openSearchField = () => {
  //  this.props.setActiveRedux(true);
  //};

  openSettings = () => {
    protectedAction({ SEMIAUTH: true }).then(() =>
      NavigationService.navigate("UserSettings")
    );
  };

  render() {
    const { isActive, searchQuery, showResults } = this.props;
    const isItem =
      this.props.navigation &&
      this.props.navigation.state.routes[
        this.props.navigation.state.routes.length - 1
      ].routeName === "Item";
    const showSearchBar = !!(searchQuery || showResults);
    return (
      <SafeAreaView style={styles.header}>
        {isActive || showSearchBar ? (
          <SearchHeader
            clearSearchQuery={this.clearSearchQuery}
            onChangeText={this.handleChangeText}
            searchQuery={searchQuery}
            onSubmitEditing={this.search}
            onFocus={this.setActive}
            resetToHome={this.resetToHome}
            setSearchRef={this.setSearchRef}
          />
        ) : (
          <HomeHeader openSettings={this.openSettings} />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  searchQuery: state.search.searchQuery,
  isActive: state.search.isActive,
  showResults: state.search.showResults
});

const mapDispatchToProps = dispatch => {
  return {
    searchRedux: searchOptions => dispatch(searchActions.search(searchOptions)),
    setActiveRedux: isActive =>
      dispatch(searchActions.searchSetActive(isActive)),
    handleSearchQueryChange: searchQuery =>
      dispatch(searchActions.searchSetSearchQuery(searchQuery)),
    goHomeRedux: () => dispatch(searchActions.searchGoHome())
  };
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
