import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
interface Props extends SvgProps {
  size?: number;
}

const SvgCheckboxSelected = (props: Props) => (
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
      d="M0 4a4 4 0 014-4h40a4 4 0 014 4v40a4 4 0 01-4 4H4a4 4 0 01-4-4V4zm2 1a3 3 0 013-3h38a3 3 0 013 3v38a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm13 6a4 4 0 00-4 4v18a4 4 0 004 4h18a4 4 0 004-4V15a4 4 0 00-4-4H15z"
      fill={props.color || "#202020"}
    />
  </Svg>
);

export default SvgCheckboxSelected;
