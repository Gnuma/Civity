import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import NavigationService from "../../navigator/NavigationService";
import Button from "../Button";
import PropTypes from "prop-types";
import styles from "./styles";
import { Header1, Header2, Header3, Header5 } from "../../components/Text";
import Item from "./Item";
import { StackActions } from "react-navigation";

export class ListMultiItem extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    isSingle: PropTypes.bool
  };

  render() {
    const { data, isSingle } = this.props;
    const { book } = data;
    return (
      <Button onPress={this.goItem} style={styles.itemButton}>
        <View style={styles.multiHeader}>
          <Header2 color={"primary"}>{book.title}</Header2>
          <Header5>{book.author}</Header5>
        </View>
        <Item data={data} isSingle={isSingle} />
      </Button>
    );
  }

  goItem = () => {
    const {
      data: { book, pk }
    } = this.props;
    const pushAction = StackActions.push({
      routeName: "Item",
      params: {
        itemID: pk,
        name: book.title,
        authors: book.author
      }
    });
    NavigationService.dispatch(pushAction);
  };
}

export default ListMultiItem;
