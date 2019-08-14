import React, { Component } from "react";
import { View, TextInput } from "react-native";
import Button from "../../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header2, Header5 } from "../../Text";
import colors from "../../../styles/colors";
import Shadows from "../../Shadows";
import OutlinedInput from "../../Form/OutlinedInput";

export default class SelectBookHeader extends Component {
  render() {
    const {
      onChangeText,
      searchQuery,
      resetSearchBar,
      handleGoBack
    } = this.props;
    return (
      <View
        style={{
          flex: 0,
          paddingHorizontal: 15,
          paddingVertical: 10,
          ...Shadows[2],
          backgroundColor: "white",
          zIndex: 2
        }}
      >
        <Header2 color={"primary"}>Seleziona il libro che vuoi vendere</Header2>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6
          }}
        >
          <Button onPress={handleGoBack} style={{ paddingRight: 10 }}>
            <Icon
              name="chevron-left"
              size={24}
              style={{ color: colors.black }}
            />
          </Button>
          <OutlinedInput
            onTextChange={onChangeText}
            value={searchQuery}
            containerStyle={{
              marginLeft: 6,
              marginRight: 30
            }}
            icon={searchQuery ? "times" : "search"}
            inputStyle={{ fontSize: 22 }}
            blurOnSubmit={true}
            autoFocus={true}
            placeholder={"eg: Matematica Verde 3"}
          />
        </View>
      </View>
    );
  }
}
