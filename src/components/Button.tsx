import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableNativeFeedback,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent
} from "react-native";
import { TouchableProps } from "react-native-svg";
import { IS_ANDROID } from "../utils/constants";

export interface ButtonProps {
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  rest?: TouchableProps;
}

export class Button extends Component<ButtonProps> {
  static defaultProps = { disabled: false };

  render() {
    const { disabled, children, style } = this.props;
    if (disabled)
      return (
        <View
          pointerEvents={IS_ANDROID ? "box-only" : "auto"}
          style={[styles.button, style]}
        >
          {children}
        </View>
      );
    else if (IS_ANDROID) return this.renderAndroid();
    else return this.renderIOS();
  }

  renderIOS = () => {
    const { disabled, children, ...rest } = this.props;
    let opacity = disabled ? 1 : 0.5;

    return (
      <TouchableOpacity activeOpacity={opacity} {...rest}>
        {children}
      </TouchableOpacity>
    );
  };

  renderAndroid = () => {
    const { disabled, children, style, onPress, ...rest } = this.props;
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        //background={TouchableNativeFeedback.Ripple()}
        useForeground={true}
        {...rest}
      >
        <View pointerEvents="box-only" style={[styles.button, style]}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  };
}

export default Button;

const styles = StyleSheet.create({
  button: {
    overflow: "hidden"
  }
});
