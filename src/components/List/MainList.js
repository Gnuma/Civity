import React, { Component } from "react";
import {
  View,
  FlatList,
  Text,
  SectionList,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import ListMultiItem from "../ListItem/ListMultiItem";
import ListSingleItem from "../ListItem/ListSingleItem";
import { Header2, Header4 } from "../../components/Text";
import colors from "../../styles/colors";
import Button from "../Button";
import NavigationService from "../../navigator/NavigationService";
import { StackActions } from "react-navigation";
import Shadows from "../Shadows";

export class MainList extends Component {
  static propTypes = {
    results: PropTypes.array,
    resultType: PropTypes.string,
    isLoading: PropTypes.bool,
    loadMore: PropTypes.func,
    loadingMore: PropTypes.bool
  };

  render() {
    const { results, resultType, isLoading, loadMore, isLast } = this.props;

    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      );
    }
    if (!results || results.length <= 0) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Header2 style={{ margin: 10, textAlign: "center" }} color="black">
            Nessun Risultato
          </Header2>
        </View>
      );
    }
    //TEST
    /*
    if (!results || results.length <= 0) {
      return (
        <Button
          onPress={() => {
            const pushAction = StackActions.push({
              routeName: "Item_Deprecated",
              params: {
                itemID: 2,
                name: "FAKE",
                authors: "FAKE"
              }
            });
            NavigationService.dispatch(pushAction);
          }}
        >
          <Header2>AOOO</Header2>
        </Button>
      );
    }
    */
    //TEST

    const isSingle = resultType === "single";

    return (
      <View style={{ flex: 1 }}>
        {isSingle && (
          <View
            style={{
              paddingLeft: 10,
              ...Shadows[3],
              backgroundColor: "#fff"
            }}
          >
            <Header2 color={"primary"} numberOfLines={2}>
              {results[0].book.title}
            </Header2>
            <Header4
              style={{ paddingBottom: 5, paddingLeft: 10 }}
              numberOfLines={1}
            >
              {results[0].book.author}
            </Header4>
          </View>
        )}
        <FlatList
          contentContainerStyle={{ paddingBottom: 10 }}
          data={results}
          renderItem={isSingle ? this._renderSingleItem : this._renderMultiItem}
          keyExtractor={this._keyExtractor}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={!isLast && this.renderLoadingMore}
        />
      </View>
    );
  }

  _keyExtractor = item => {
    return item.pk.toString();
  };

  _renderMultiItem = ({ item }) => {
    return <ListMultiItem data={item} />;
  };

  _renderSingleItem = ({ item }) => {
    return <ListSingleItem data={item} isSingle={true} />;
  };

  renderLoadingMore = () => {
    return (
      <View style={{ margin: 15, alignItems: "center" }}>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    );
  };
}

export default MainList;
