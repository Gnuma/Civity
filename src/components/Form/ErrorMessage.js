import React, { Component } from "react";
import { Text, View } from "react-native";
import Card from "../Card";
import colors from "../../styles/colors";
import { Header3 } from "../Text";
import Icon from "react-native-vector-icons/FontAwesome";

export default class ErrorMessage extends Component {
  render() {
    const { message, containerStyle, style, ...rest } = this.props;

    return (
      <Card
        style={[
          {
            backgroundColor: colors.darkRed,
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            marginVertical: 4,
            marginHorizontal: 8
          },
          containerStyle
        ]}
      >
        <Header3
          style={[{ flex: 1, marginRight: 10 }, style]}
          color="white"
          {...rest}
        >
          {message}
        </Header3>
        <View
          style={{ width: 36, justifyContent: "center", alignItems: "center" }}
        >
          <Icon
            name={"exclamation"}
            size={30}
            style={{ color: colors.white }}
          />
        </View>
      </Card>
    );
  }
}
