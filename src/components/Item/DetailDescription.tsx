import React from "react";
import { View } from "react-native";
import styles from "./styles";
import { Text } from "../Text";

const DetailDescription = ({ description }: { description?: string }) => {
  if (description == null) return null;
  return (
    <View style={styles.descriptionContainer}>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default DetailDescription;
