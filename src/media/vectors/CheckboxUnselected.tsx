import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
interface Props extends SvgProps {
  size?: number;
}

const SvgCheckboxUnselected = (props: Props) => (
  <Svg
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 0a4 4 0 00-4 4v40a4 4 0 004 4h40a4 4 0 004-4V4a4 4 0 00-4-4H4zm1 2a3 3 0 00-3 3v38a3 3 0 003 3h38a3 3 0 003-3V5a3 3 0 00-3-3H5z"
      fill={props.color || "#202020"}
    />
  </Svg>
);

export default SvgCheckboxUnselected;
