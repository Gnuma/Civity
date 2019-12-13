import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  StyleProp,
  ViewStyle
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { GeneralItem } from "../../types/ItemTypes";
import ItemSmall from "./ItemSmall";
import Shadows from "../Shadows";

interface ItemCarouselProps {
  size?: number;
  items: GeneralItem[];
  style?: StyleProp<ViewStyle>;
  separation?: number;
}

const ItemCarousel = ({
  size = 165,
  items,
  style,
  separation = 6
}: ItemCarouselProps) => {
  const vw = Dimensions.get("window").width;
  const renderItem = ({ item }: { item: GeneralItem }) => {
    return (
      <View style={[{ width: size, height: size }, styles.itemContainer]}>
        <ItemSmall width={size} height={size} item={item} />
      </View>
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.pk}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={style}
      ItemSeparatorComponent={() => <View style={{ width: separation }}></View>}
    />
  );
};

export default ItemCarousel;

const styles = StyleSheet.create({
  itemContainer: {},
  carouselContainer: {
    justifyContent: "flex-start"
  }
});
