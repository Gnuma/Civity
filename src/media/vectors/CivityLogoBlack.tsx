import React from "react";
import Svg, { Circle, Rect, SvgProps } from "react-native-svg";

interface Props extends SvgProps {
  size?: number;
}

const SvgCivityLogoBlack = (props: Props) => (
  <Svg
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 74 74"
    fill="none"
    {...props}
  >
    <Circle cx={37} cy={37} r={37} fill={props.color || "#202020"} />
    <Rect
      x={58.197}
      y={33.679}
      width={6.747}
      height={42.348}
      rx={3.373}
      transform="rotate(90 58.197 33.68)"
      fill="#00BA75"
    />
    <Rect
      x={33.478}
      y={15.85}
      width={7.091}
      height={42.348}
      rx={3.546}
      fill="#4FEEA4"
    />
  </Svg>
);

export default SvgCivityLogoBlack;
