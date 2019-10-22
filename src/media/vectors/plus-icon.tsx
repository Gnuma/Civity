import React from "react";
import Svg, { Rect } from "react-native-svg";
import { VectorStyle } from "./types";

const SvgComponent = (props: VectorStyle) => (
  <Svg width="1em" height="1em" viewBox="0 0 138 138" fill="none" {...props}>
    <Rect
      x={137.255}
      y={58.16}
      width={21.868}
      height={137.255}
      rx={10.934}
      transform="rotate(90 137.255 58.16)"
      fill="#00BA75"
    />
    <Rect
      x={57.133}
      y={0.373}
      width={22.983}
      height={137.255}
      rx={11.492}
      fill="#4FEEA4"
    />
  </Svg>
);

export default SvgComponent;
