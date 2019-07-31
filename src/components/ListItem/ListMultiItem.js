import React, { Component } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import NavigationService from "../../navigator/NavigationService";
import Button from "../Button";
import PropTypes from "prop-types";
import styles from "./styles";
import { Header1, Header2, Header3, Header5 } from "../../components/Text";
import Item from "./Item";
import { StackActions } from "react-navigation";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import colors from "../../styles/colors";

export class ListMultiItem extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    isSingle: PropTypes.bool,
    native: PropTypes.bool
  };

  render() {
    const { data, isSingle, native } = this.props;
    const { book } = data;

    console.log(native);
    if (native) return this.renderNative(data, book, isSingle);

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

  renderNative = (data, book, isSingle) => {
    return (
      <NativeButton onPress={this.goItem} style={styles.itemButton}>
        <View style={styles.multiHeader}>
          <Header2 color={"primary"}>{book.title}</Header2>
          <Header5>{book.author}</Header5>
        </View>
        <Item data={data} isSingle={isSingle} />
      </NativeButton>
    );
  };

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

const NativeButton = ({ onPress, children }) => {
  return (
    <View
      style={{
        margin: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
        overflow: "hidden",
        elevation: 3
      }}
      onPress={onPress}
    >
      <TouchableNativeFeedback
        style={{
          flex: 1
        }}
      >
        {children}
      </TouchableNativeFeedback>
    </View>
  );
};
