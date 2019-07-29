import React from "react";
import Svg, { Path } from "react-native-svg";

const SvgComponent = props => (
  <Svg width={29} height={29} fill="none" {...props}>
    <Path
      d="M18.605 18.605a1.75 1.75 0 0 1 2.475 0l7.248 7.247-2.476 2.476-7.247-7.248a1.75 1.75 0 0 1 0-2.475z"
      fill="#000"
    />
    <Path d="M19.5 10.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="#000" />
  </Svg>
);

export default SvgComponent;
