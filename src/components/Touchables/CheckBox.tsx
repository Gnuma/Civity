import React from "react";
import { View, Text, TouchableOpacityProps } from "react-native";
import CheckBoxSelectedIcon from "../../media/vectors/CheckboxSelected";
import CheckBoxUnselectedIcon from "../../media/vectors/CheckboxUnselected";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface SelectableProps extends TouchableOpacityProps {
  selected?: boolean;
}
const CheckBox = ({ selected, ...rest }: SelectableProps) => {
  return (
    <TouchableOpacity {...rest}>
      {selected ? (
        <CheckBoxSelectedIcon size={20} />
      ) : (
        <CheckBoxUnselectedIcon />
      )}
    </TouchableOpacity>
  );
};

export default CheckBox;
