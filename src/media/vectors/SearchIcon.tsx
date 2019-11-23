import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
interface Props extends SvgProps {
  size?: number;
}

const SvgSearchIcon = (props: Props) => (
  <Svg
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 26 26"
    fill="none"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.015 9.507A7.507 7.507 0 112 9.507a7.507 7.507 0 0115.015 0zm2 0A9.507 9.507 0 110 9.507a9.507 9.507 0 0119.015 0zm-2.23 7.165a2.147 2.147 0 00-.113 3.035l4.667 5.03a2.147 2.147 0 103.149-2.92l-4.668-5.03a2.147 2.147 0 00-3.034-.115z"
      fill={props.color || "#202020"}
    />
  </Svg>
);

export default SvgSearchIcon;
