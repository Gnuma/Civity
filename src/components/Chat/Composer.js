import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  PermissionsAndroid,
  Platform
} from "react-native";
import Button from "../Button";
import colors from "../../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header4, Header3, Header2 } from "../Text";
import NativeButton from "../NativeButton";
import { ChatStatus, ChatType } from "../../utils/constants";

export default class Composer extends Component {
  state = {};

  renderBlockedComposer = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ComposerContainer>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              margin: 6,
              alignItems: "center"
            }}
          >
            <Header3 color="black" style={{ flex: 1 }}>
              La chat non è più attiva. L'inserzione è stata eliminata o venduta
              ad un altro utente.
            </Header3>
            <Icon
              name={"ban"}
              size={40}
              style={{ color: colors.darkRed, marginHorizontal: 10 }}
            />
          </View>
        </ComposerContainer>
      </View>
    );
  };

  render() {
    const { text, onSend, onComposerTextChanged, data, type } = this.props;
    if (
      data.status == ChatStatus.BLOCKED ||
      data.status == ChatStatus.REJECTED
    ) {
      return this.renderBlockedComposer();
    }
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ComposerContainer>
          <TextInput
            style={{ flex: 1, fontSize: 18, maxHeight: 130, paddingLeft: 14 }}
            multiline={true}
            placeholder="Scrivi un messaggio"
            onChangeText={onComposerTextChanged}
            value={text}
            maxLength={500}
          />
          <NativeButton
            style={{
              width: 40,
              height: 40,
              marginHorizontal: 10,
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              borderRadius: 20,
              backgroundColor: colors.white
            }}
            onPress={onSend}
            disabled={!text}
          >
            <Icon
              name={"paper-plane"}
              size={26}
              style={{ color: !text ? colors.black : colors.secondary }}
            />
          </NativeButton>
        </ComposerContainer>
      </View>
    );
  }
}

export const ComposerContainer = ({ children }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        borderRadius: 10,
        backgroundColor: colors.white,
        elevation: 2,
        marginBottom: 10,
        marginTop: 5,
        marginHorizontal: 20,
        minHeight: 50
      }}
    >
      {children}
    </View>
  );
};
