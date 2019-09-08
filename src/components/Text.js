import React from "react";
import { Text as RText, View } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../styles/colors";
import UsernameInfo from "./UsernameInfo";

export function Header1({ children, style, color, ...rest }) {
  return (
    <RText style={[styles.h1, { color: colors[color] }, style]} {...rest}>
      {children}
    </RText>
  );
}

export function Header2({ children, style, color, ...rest }) {
  return (
    <RText style={[styles.h2, { color: colors[color] }, style]} {...rest}>
      {children}
    </RText>
  );
}

export function Header3({ children, style, color, ...rest }) {
  return (
    <RText style={[styles.h3, { color: colors[color] }, style]} {...rest}>
      {children}
    </RText>
  );
}

export function Header4({ children, style, color, ...rest }) {
  return (
    <RText style={[styles.h4, { color: colors[color] }, style]} {...rest}>
      {children}
    </RText>
  );
}

export function Header5({ children, style, color, ...rest }) {
  return (
    <RText style={[styles.h5, { color: colors[color] }, style]} {...rest}>
      {children}
    </RText>
  );
}

export function Username({
  size = 18,
  username,
  style,
  containerStyle,
  infoStyle = { marginLeft: -20 },
  textProps,
  userInfo
}) {
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
          containerStyle={styles.usernameInfoContainer}
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
