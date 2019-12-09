import React from "react";
import { View } from "react-native";
import styles from "./styles";
import { Header4 } from "../Text";
import { BasicItem } from "../../types/ItemTypes";
import { PreviewItem } from "../../store/sell/types";

interface DetailSecondaryInfosProps {
  item: BasicItem | PreviewItem;
}

const DetailSecondaryInfos = ({ item }: DetailSecondaryInfosProps) => {
  return (
    <View style={styles.info}>
      <View style={styles.infoRow}>
        <Header4 style={styles.infoLabel}>ISBN</Header4>
        <Header4>{item.book.isbn}</Header4>
      </View>
      <View style={styles.infoRow}>
        <Header4 style={styles.infoLabel}>Materia</Header4>
        <Header4>{item.book.subject.title}</Header4>
      </View>
    </View>
  );
};

export default DetailSecondaryInfos;
