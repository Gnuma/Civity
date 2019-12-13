import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";

interface GoBackButtonProps {
  goBack: () => void;
}

const GoBackButton = ({ goBack }: GoBackButtonProps) => {
  return (
    <TouchableOpacity onPress={goBack} style={styles.backBtn}>
      <Icon name="chevron-left" style={styles.backIcon} size={24} />
    </TouchableOpacity>
  );
};

export default GoBackButton;

const styles = StyleSheet.create({
  backBtn: {
    padding: 15,
    borderRadius: 999
  },
  backIcon: {
    color: colors.black
  }
});
