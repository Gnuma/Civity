import React, { Component } from "react";
import { StatusBar } from "react-native";
import colors from "../styles/colors";

export const GreenBar = ({ ...rest }) => {
  return (
    <StatusBar
      backgroundColor={colors.darkGreen}
      barStyle="light-content"
      animated
      translucent={false}
      {...rest}
    />
  );
};

export const GreyBar = ({ ...rest }) => {
  return (
    <StatusBar
      backgroundColor={colors.lightGrey}
      barStyle="light-content"
      animated
      translucent={false}
      {...rest}
    />
  );
};

export const HiddenBar = ({ ...rest }) => {
  return <StatusBar barStyle="default" animated hidden />;
};

export const TransparentBar = ({ ...rest }) => {
  return (
    <StatusBar
      barStyle="light-content"
      animated
      translucent
      backgroundColor={"rgba(0,0,0,0.3)"}
      {...rest}
    />
  );
};

export const WhiteBar = ({ ...rest }) => {
  return (
    <StatusBar
      barStyle="dark-content"
      animated
      backgroundColor={colors.white}
      translucent={false}
    />
  );
};
