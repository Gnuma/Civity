import React, { Component } from "react";
import { View, TextInput } from "react-native";
import Button from "../../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header2, Header5 } from "../../Text";
import colors from "../../../styles/colors";

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
          elevation: 6,
          backgroundColor: "white"
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
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              borderRadius: 6,
              overflow: "hidden",
              backgroundColor: "white",
              elevation: 2
            }}
          >
            <TextInput
              onChangeText={onChangeText}
              value={searchQuery}
              style={{
                flex: 1,
                fontSize: 22,
                marginLeft: 6,
                marginRight: 30,
                padding: 8
              }}
              blurOnSubmit={true}
              autoFocus={true}
              placeholder={"eg: Matematica Verde 3"}
            />
            <Button
              onPress={resetSearchBar}
              style={{ right: 10, alignSelf: "center" }}
            >
              <Icon
                name="times"
                size={24}
                style={{ color: "black", alignSelf: "center" }}
              />
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
