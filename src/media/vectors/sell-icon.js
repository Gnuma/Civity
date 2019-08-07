import React from "react";
import Svg, { Rect } from "react-native-svg";

const SvgComponent = ({ color, ...rest }) => (
  <Svg width="20em" height="20em" viewBox="0 0 25 26" fill="none" {...rest}>
    <Rect
      x={25}
      y={10.663}
      width={3.983}
      height={25}
      rx={1.992}
      transform="rotate(90 25 10.663)"
      fill={color}
    />
    <Rect
      x={10.405}
      y={0.137}
      width={4.186}
      height={25}
      rx={2.093}
      fill={color}
    />
  </Svg>
);

export default SvgComponent;
