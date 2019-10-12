import React, { Component } from "react";
import { StatusBar, StatusBarProps } from "react-native";
import colors from "../styles/colors";
import { IS_ANDROID } from "../utils/constants";

export const GreenBar = ({ ...rest }: StatusBarProps) => {
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

export const GreyBar = ({ ...rest }: StatusBarProps) => {
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

export const HiddenBar = ({ ...rest }: StatusBarProps) => {
  return <StatusBar barStyle="default" animated hidden />;
};

export const TransparentBar = ({ ...rest }: StatusBarProps) => {
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

export const WhiteBar = ({ ...rest }: StatusBarProps) => {
  return (
    <StatusBar
      barStyle="dark-content"
      animated
      backgroundColor={colors.white}
      translucent={false}
    />
  );
};

export const setGreyBar = () => {
  if (IS_ANDROID) {
    StatusBar.setBarStyle("light-content");
    StatusBar.setBackgroundColor(colors.lightGrey);
  } else StatusBar.setBarStyle("dark-content");
};

export const DarkContent = () => {
  return <StatusBar barStyle="dark-content" />;
};
export const LightContent = () => {
  return <StatusBar barStyle="light-content" />;
};

export const setLightContent = () => StatusBar.setBarStyle("light-content");
