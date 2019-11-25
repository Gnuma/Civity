import React from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextProps
} from "react-native";
import { Text } from "../Text";
import colors from "../../styles/colors";
import SolidTimesIcon from "../../media/vectors/SolidTimesIcon";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface BadgeProps {
  value?: string;
  onDelete?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textProps?: TextProps;
}

const Badge = ({
  value,
  onDelete,
  style,
  textStyle,
  textProps
}: BadgeProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]} {...textProps}>
        {value}
      </Text>
      {!!onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <SolidTimesIcon
            size={25}
            color={colors.lightGrey}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    height: 45,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    color: colors.secondary,
    fontSize: 16,
    flex: 1
  },
  deleteIcon: {
    marginLeft: 8
  }
});
