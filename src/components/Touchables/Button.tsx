import React from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
  TextStyle,
  TouchableOpacityProps,
  TextProps
} from "react-native";
import { Text } from "../Text";
import {
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native-gesture-handler";
import { TouchableProps } from "react-native-svg";
import colors from "../../styles/colors";

export interface ButtonProps extends TouchableOpacityProps {
  value?: string;
  type?: "primary" | "secondary";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  rest?: TouchableProps;
  extend?: boolean;
  textProps?: TextProps;
  children?: React.ReactNode;
}

const Button = ({
  value,
  type = "primary",
  disabled = false,
  style: propStyle,
  textStyle: propTextStyle,
  onPress,
  textProps,
  children,
  ...rest
}: ButtonProps) => {
  const containerStyle = disabled ? buttonStyles.disabled : buttonStyles[type];
  /*tslint:disable*/
  const textStyle = disabled
    ? buttonStyles.disabledText
    : buttonStyles[type + "Text"];
  /*tslint-enable */
  return (
    <TouchableOpacity
      style={[buttonStyles.button, containerStyle, propStyle]}
      onPress={onPress}
      disabled={disabled}
      {...rest}
    >
      <Text
        style={[buttonStyles.text, textStyle, propTextStyle]}
        {...textProps}
      >
        {value}
      </Text>
      {children}
    </TouchableOpacity>
  );
};

export default Button;

export const buttonStyles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 16
  },
  primary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary
  },
  secondary: {
    backgroundColor: "transparent",
    borderColor: colors.lightGrey
  },
  disabled: {
    backgroundColor: colors.grey
  },
  primaryText: {
    color: colors.white
  },
  secondaryText: {
    color: colors.lightGrey
  },
  disabledText: {
    color: colors.white
  },
  red: {}
});
