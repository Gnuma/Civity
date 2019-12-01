import React from "react";
import { View, Text } from "react-native";

interface ModalProps {
  children?: React.ReactNode;
}
const Modal = ({ children }: ModalProps) => {
  return <View>{children}</View>;
};

export default Modal;
