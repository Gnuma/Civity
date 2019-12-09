import React, { Fragment } from "react";
import { View, Text } from "react-native";
import { Header1, Header4, Price } from "../Text";
import { printAuthors } from "../../utils/helper";
import styles from "./styles";
import { BasicItem } from "../../types/ItemTypes";
import ConditionTag from "./ConditionTag";
import { PreviewItem } from "../../store/sell/types";

interface ItemDetailInfosProps {
  item: BasicItem | PreviewItem;
}

const ItemDetailInfos = ({ item }: ItemDetailInfosProps) => {
  return (
    <Fragment>
      <Header1 color="primary" style={styles.bold}>
        {item.book.title}
      </Header1>
      <Header4 color="black">Di {printAuthors(item.book.authors)}</Header4>
      <View style={styles.priceContainer}>
        <Price
          color="primary"
          containerStyle={styles.price}
          style={styles.bold}
        >
          {item.price}
        </Price>
        <ConditionTag type={item.condition} />
      </View>
    </Fragment>
  );
};

export default ItemDetailInfos;
