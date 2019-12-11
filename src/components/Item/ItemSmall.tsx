import React from "react";
import { View, StyleSheet } from "react-native";
import { GeneralItem } from "../../types/ItemTypes";
import colors from "../../styles/colors";
import Shadows from "../Shadows";
import Image from "react-native-fast-image";
import { Header3, Header4, Price } from "../Text";
import { printAuthors } from "../../utils/helper";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchIcon from "../../media/vectors/SearchIcon";

export interface ItemSmallProps {
  width: number;
  height: number;
  item: GeneralItem;
}

const ItemSmall = ({ width, height, item }: ItemSmallProps) => {
  const size = { width, height };

  return (
    <TouchableOpacity style={(styles.outerContainer, size)}>
      <View style={[styles.container]}>
        <SearchIcon color={colors.white} size={23} style={styles.searchIcon} />
        <View
          style={[
            styles.imageContainer,
            size,
            { borderBottomRightRadius: Math.min(width, height) }
          ]}
        >
          <Image
            source={{ uri: item.image_ad[0] }}
            style={[styles.img, size]}
          />
          <View style={styles.overlay} />
        </View>
        <View style={styles.contentContainer}>
          <Header3 color="white">{item.book.title}</Header3>
          <Header4 color="white" numberOfLines={1} style={styles.authors}>
            {printAuthors(item.book.authors)}
          </Header4>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Price color="white" style={styles.price} size={45}>
              24
            </Price>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemSmall;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: colors.secondary,
    ...Shadows[0]
  },
  container: {
    borderRadius: 10,
    backgroundColor: colors.secondary,
    overflow: "hidden"
  },
  imageContainer: {
    zIndex: 2,
    overflow: "hidden",
    backgroundColor: colors.secondary
  },
  img: {},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black + "AA"
  },
  contentContainer: {
    zIndex: 3,
    ...StyleSheet.absoluteFillObject,
    padding: 6
  },
  authors: { flex: 1 },
  price: {
    fontSize: 22,
    lineHeight: 22
  },
  searchIcon: {
    position: "absolute",
    right: 5,
    bottom: 5,
    zIndex: 1
  }
});
