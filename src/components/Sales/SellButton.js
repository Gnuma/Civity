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
          height: 40,
          width: 40,
          backgroundColor: colors.black,
          elevation: 2,
          borderRadius: 20,
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
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
