import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
interface Props extends SvgProps {
  size?: number;
}

const SvgCivitySquareIcon = (props: Props) => (
  <Svg
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 27 27"
    fill="none"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2h6.631a8 8 0 018 8v6.631a8 8 0 01-8 8H10a8 8 0 01-8-8V10a8 8 0 018-8zM0 10C0 4.477 4.477 0 10 0h6.631c5.523 0 10 4.477 10 10v6.631c0 5.523-4.477 10-10 10H10c-5.523 0-10-4.477-10-10V10zm12.25-2.808a1.274 1.274 0 112.548 0v5.272h5.094a1.239 1.239 0 010 2.477h-5.094v5.25a1.274 1.274 0 01-2.547 0v-5.25H7.156a1.239 1.239 0 110-2.477h5.095V7.192z"
      fill={props.color || "#202020"}
    />
  </Svg>
);

export default SvgCivitySquareIcon;
