import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import { withNavigation, StackActions } from "react-navigation";
import Button from "../Button";
import PropTypes from "prop-types";
import styles from "./styles";
import Item from "./Item";

export class ListSingleItem extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    const { data } = this.props;
    return (
      <Button onPress={this.goItem} style={styles.itemButton}>
        <Item data={this.props.data} isSingle={this.props.isSingle} />
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

    this.props.navigation.dispatch(pushAction);
  };
}

export default withNavigation(ListSingleItem);
