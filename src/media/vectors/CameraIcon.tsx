import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
interface Props extends SvgProps {
  size?: number;
}

const SvgCameraIcon = (props: Props) => (
  <Svg
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 25 21"
    fill="none"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 17.237V6.208a2.908 2.908 0 012.903-2.902H6.96l.097-.424A3.717 3.717 0 0110.69 0h3.617a3.708 3.708 0 013.633 2.882l.097.424h4.06C23.7 3.306 25 4.606 25 6.208v11.03a3.053 3.053 0 01-3.051 3.05H3.05A3.053 3.053 0 010 17.238zm12.615-.09a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z"
      fill={props.color || "#202020"}
    />
  </Svg>
);

export default SvgCameraIcon;
