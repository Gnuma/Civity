import React, { Component } from "react";
import { View } from "react-native";
import Button from "../Button";
import { Header2 } from "../Text";
import IconPlus from "../../media/vectors/plus-icon";
import colors from "../../styles/colors";
import Shadows from "../Shadows";

export class ContactButton extends Component {
  render() {
    return (
      <Button
        style={{
          height: 40,
          width: 40,
          backgroundColor: colors.black,
          ...Shadows[2],
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={this.props.onPress}
      >
        <IconPlus width="30em" height="30em" />
      </Button>
    );
  }
}

export default ContactButton;
