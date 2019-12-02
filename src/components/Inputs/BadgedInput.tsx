import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  StyleProp,
  ViewStyle
} from "react-native";
import LabeledInput, { LabeledInputProps } from "./LabeledInput";
import Badge, { BadgeProps } from "../Touchables/Badge";
import Button from "../Touchables/Button";

interface BadgedInputProps<B> extends LabeledInputProps {
  badges?: B[];
  badgeProps?: BadgeProps;
  onDelete?: (index: number) => void;
  onAdd?: () => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
}

function BadgedInput<B>({
  badges = [],
  badgeProps,
  onDelete,
  onAdd,
  containerStyle,
  contentContainerStyle,
  listStyle,
  ...rest
}: BadgedInputProps<B>) {
  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <Badge
        value={item}
        onDelete={() => onDelete && onDelete(index)}
        textProps={{ numberOfLines: 1 }}
        textStyle={{ maxWidth: 150 }}
        style={styles.badge}
      />
    );
  };

  return (
    <View style={[containerStyle]}>
      <View style={styles.inputContainer}>
        <LabeledInput
          containerStyle={[styles.input, contentContainerStyle]}
          {...rest}
        />
        <Button value="Add" style={styles.add} onPress={onAdd} />
      </View>
      <FlatList
        horizontal
        data={badges}
        contentContainerStyle={styles.badgesList}
        renderItem={renderItem}
        style={listStyle}
      />
    </View>
  );
}

export default BadgedInput;

const styles = StyleSheet.create({
  badgesList: {
    height: 60
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10
  },
  input: {
    flex: 1
  },
  add: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 4,
    marginLeft: 10
  },
  badge: {
    marginRight: 5
  }
});
