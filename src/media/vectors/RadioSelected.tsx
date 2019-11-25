import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
interface Props extends SvgProps {
  size?: number;
}

const SvgRadioSelected = (props: Props) => (
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
      d="M48 24c0 13.255-10.745 24-24 24S0 37.255 0 24 10.745 0 24 0s24 10.745 24 24zm-2 0c0 12.15-9.85 22-22 22S2 36.15 2 24 11.85 2 24 2s22 9.85 22 22zM24 38.4c7.953 0 14.4-6.447 14.4-14.4S31.953 9.6 24 9.6 9.6 16.047 9.6 24 16.047 38.4 24 38.4z"
      fill={props.color || "#202020"}
    />
  </Svg>
);

export default SvgRadioSelected;
