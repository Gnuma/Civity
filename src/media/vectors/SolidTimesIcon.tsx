import React from "react";
import Svg, { Path, Rect, SvgProps } from "react-native-svg";
interface Props extends SvgProps {
  size?: number;
}

const SvgSolidTimesIcon = (props: Props) => (
  <Svg
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <Path
      d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0s10 4.477 10 10z"
      fill={props.color || "#202020"}
    />
    <Rect
      width={1.517}
      height={9.314}
      rx={0.758}
      transform="rotate(135 4.264 9.415) skewX(-.001)"
      fill="#fff"
      fillOpacity={0.95}
    />
    <Rect
      x={12.926}
      y={6.379}
      width={1.56}
      height={9.519}
      rx={0.78}
      transform="rotate(45 12.926 6.38)"
      fill="#fff"
    />
  </Svg>
);

export default SvgSolidTimesIcon;
