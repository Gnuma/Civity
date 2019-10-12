import React from "react";
import {
  Text as RText,
  View,
  TextStyle,
  TextProps,
  StyleProp,
  ViewStyle
} from "react-native";
import { StyleSheet } from "react-native";
import colors, { ColorType } from "../styles/colors";
import UsernameInfo, { UsernameInfoType } from "./UsernameInfo";

interface Props extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  color?: ColorType;
  rest?: TextProps;
}

export function Header1({ children, style, color, ...rest }: Props) {
  return (
    <RText
      style={[styles.h1, color && { color: colors[color] }, style]}
      {...rest}
    >
      {children}
    </RText>
  );
}

export function Header2({ children, style, color, ...rest }: Props) {
  return (
    <RText
      style={[styles.h2, color && { color: colors[color] }, style]}
      {...rest}
    >
      {children}
    </RText>
  );
}

export function Header3({ children, style, color, ...rest }: Props) {
  return (
    <RText
      style={[styles.h3, color && { color: colors[color] }, style]}
      {...rest}
    >
      {children}
    </RText>
  );
}

export function Header4({ children, style, color, ...rest }: Props) {
  return (
    <RText
      style={[styles.h4, color && { color: colors[color] }, style]}
      {...rest}
    >
      {children}
    </RText>
  );
}

export function Header5({ children, style, color, ...rest }: Props) {
  return (
    <RText
      style={[styles.h5, color && { color: colors[color] }, style]}
      {...rest}
    >
      {children}
    </RText>
  );
}

interface UsernameProps {
  size?: number;
  username: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  infoStyle?: StyleProp<ViewStyle>;
  textProps: any;
  userInfo: UsernameInfoType;
}

export function Username({
  size = 18,
  username,
  style,
  containerStyle,
  infoStyle = { marginLeft: -20 },
  textProps,
  userInfo
}: UsernameProps) {
  return (
    <View style={[styles.usernameContainer, containerStyle]}>
      <Header3
        style={[styles.usernameText, { fontSize: size }, style]}
        numberOfLines={1}
        {...textProps}
      >
        {username}
      </Header3>
      {userInfo && (
        <UsernameInfo
          size={size + size * 0.6}
          userInfo={userInfo}
          style={infoStyle}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 27
    //fontWeight: "700"
  },
  h2: {
    fontSize: 22
    //fontWeight: "500"
  },
  h3: {
    fontSize: 18
    //fontWeight: "400"
  },
  h4: {
    fontSize: 14
    //fontWeight: "300"
  },
  h5: {
    fontSize: 11,
    fontWeight: "300"
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  usernameText: {
    marginRight: 25
  }
});
