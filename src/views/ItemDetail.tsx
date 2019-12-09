import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import { GeneralBook, GeneralItem } from "../types/ItemTypes";
import BookHeader from "../components/Item/BookHeader";
import axios from "axios";
import { ___GET_AD___ } from "../store/endpoints";
import colors from "../styles/colors";
import ImageAdSlider from "../components/Item/ImageAdSlider";
import { imageAdToWidthRatio, imageAdMargin } from "../components/Item/styles";
import ItemDetailInfos from "../components/Item/DetailInfos";
import Divider from "../components/Divider";
import DetailDescription from "../components/Item/DetailDescription";
import DetailSecondaryInfos from "../components/Item/DetailSecondaryInfos";
import SellerInfo from "../components/Item/SellerInfo";

interface ItemDetailProps {
  navigation: NavigationStackProp;
}

const ItemDetail = ({ navigation }: ItemDetailProps) => {
  const book = navigation.getParam("book", errorBook);
  const [item, setItem] = useState<GeneralItem | null>(null);

  useEffect(() => {
    const id = navigation.getParam("itemID", "Error");
    axios
      .get(___GET_AD___ + `${id}/`)
      .then(res => {
        console.log(res.data);
        setItem(res.data);
      })
      .catch(err => {
        /**TODO */
      });
  }, []);

  const wh = Dimensions.get("window").width;
  const containerMargin = (wh * (1 - imageAdToWidthRatio)) / 2 + imageAdMargin;

  return (
    <View style={styles.container}>
      <BookHeader book={book} />
      {!item ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : (
        <View>
          <ImageAdSlider image_ad={item.image_ad} style={styles.imageAdSlide} />
          <View
            style={{
              marginHorizontal: containerMargin
            }}
          >
            <ItemDetailInfos item={item} />
            <SellerInfo seller={item.seller} />
            <Divider />
            <DetailDescription description={item.description} />
            <Divider />
            <DetailSecondaryInfos item={item} />
          </View>
        </View>
      )}
    </View>
  );
};

export default ItemDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageAdSlide: {
    marginTop: 20
  }
});

const errorBook: GeneralBook = {
  title: "ERROR",
  isbn: "0",
  authors: [],
  subject: { _id: 0, title: "" }
};
