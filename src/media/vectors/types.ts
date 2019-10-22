import { ViewStyle } from "react-native";
import { ColorType } from "../../styles/colors";
import { SvgProps } from "react-native-svg";

export interface VectorStyle extends SvgProps {
  color?: string;
}
