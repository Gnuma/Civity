import React from "react";
import { TextStyle, StyleSheet, ViewStyle, StyleProp } from "react-native";
import Button, { ButtonProps } from "./Button";
import colors from "../../styles/colors";

export type SelectableClassType = "green" | "yellow" | "red";

export interface SelectableProps extends ButtonProps {
  selected?: boolean;
  activeStyle?: StyleProp<ViewStyle>;
  activeTextStyle?: StyleProp<TextStyle>;
  inactiveStyle?: StyleProp<ViewStyle>;
  inactiveTextStyle?: StyleProp<TextStyle>;
  classType?: SelectableClassType;
}
const Selectable = ({
  selected = false,
  style: propStyle,
  textStyle: propStyleText,
  classType = "green",
  ...rest
}: SelectableProps) => {
  const styleClass = classType + (selected ? "Selected" : "Unselected");
  const textStyleClass =
    classType + "Text" + (selected ? "Selected" : "Unselected");
  return (
    <Button
      {...rest}
      style={[styles.selectable, propStyle, styles[styleClass]]}
      textStyle={[
        !selected ? styles.selectableTextSelected : undefined,
        propStyleText,
        styles[textStyleClass]
      ]}
    />
  );
};

export default Selectable;

const styles = StyleSheet.create({
  selectable: {
    borderColor: colors.secondary,
    borderRadius: 999
  },
  selectableTextSelected: {
    color: colors.secondary
  },

  greenSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary
  },
  greenUnselected: {
    borderColor: colors.secondary,
    backgroundColor: "transparent"
  },
  greenTextSelected: {
    color: colors.white
  },
  greenTextUnselected: {
    color: colors.secondary
  },

  redSelected: {
    borderColor: colors.darkRed,
    backgroundColor: colors.darkRed
  },
  redUnselected: {
    borderColor: colors.darkRed,
    backgroundColor: "transparent"
  },
  redTextSelected: {
    color: colors.white
  },
  redTextUnselected: {
    color: colors.darkRed
  },

  yellowSelected: {
    borderColor: colors.lightYellow,
    backgroundColor: colors.lightYellow
  },
  yellowUnselected: {
    borderColor: colors.lightYellow,
    backgroundColor: "transparent"
  },
  yellowTextSelected: {
    color: colors.white
  },
  yellowTextUnselected: {
    color: colors.lightYellow
  }
});
