import React, { Component } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";

export default ({ goBack }: { goBack: (keys?: any) => void }) => {
  return (
    <TouchableOpacity
      style={{
        padding: 10,
        backgroundColor: colors.white
      }}
      onPress={goBack}
    >
      <Icon name={"chevron-left"} size={24} style={{ color: colors.black }} />
    </TouchableOpacity>
  );
};
