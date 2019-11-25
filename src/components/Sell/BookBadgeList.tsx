import React, { SFC } from "react";
import {
  View,
  Text,
  StyleSheet,
  ListRenderItem,
  ScrollViewProps,
  FlatList,
  FlatListProps
} from "react-native";
import Badge, { BadgeProps } from "../Touchables/Badge";
import { Header3 } from "../Text";

interface BookBadgeListProps {
  data: { title: string; isbn: string }[];
  onDelete: (id: string) => void;
}

const BookBadgeList = ({ data, onDelete }: BookBadgeListProps) => {
  const renderBadge: ListRenderItem<any> = ({ item, index }) => (
    <Badge
      value={item.title}
      onDelete={() => onDelete && onDelete(item.isbn)}
      textProps={{ numberOfLines: 1 }}
      textStyle={{ maxWidth: 130 }}
    />
  );
  const keyExtractor = (item: { title: string; isbn: string }, index: number) =>
    item.isbn;
  if (data.length === 0)
    return (
      <Header3 color={"primary"} style={{ textAlign: "center", fontSize: 19 }}>
        Seleziona i libri che vuoi vendere
      </Header3>
    );
  else
    return (
      <FlatList
        data={data}
        renderItem={renderBadge}
        keyExtractor={keyExtractor}
        horizontal={true}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        contentContainerStyle={styles.container}
      />
    );
};

export default BookBadgeList;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 10
  }
});
