import React, { Component } from "react";
import { View } from "react-native";
import Button from "../Button";
import { Header2 } from "../Text";
import IconPlus from "../../media/vectors/plus-icon";
import colors from "../../styles/colors";

export class ContactButton extends Component {
  render() {
    return (
      <Button
        style={{
          backgroundColor: colors.white,
          elevation: 2,
          borderRadius: 8,
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
          padding: 6
        }}
        onPress={this.props.onPress}
      >
        <IconPlus />
      </Button>
    );
  }
}

export default ContactButton;
