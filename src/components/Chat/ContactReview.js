import React, { Component } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import colors from "../../styles/colors";
import { Header3 } from "../Text";
import SolidButton from "../SolidButton";
import { ChatType, ChatStatus } from "../../utils/constants";
import { ComposerContainer } from "./Composer";

export default class ContactReview extends Component {
  _getBuyerContent = () => {
    const {
      username,
      onContactRequest,
      objectID,
      chatID,
      isLoading
    } = this.props;

    return (
      <View
        style={{
          backgroundColor: colors.white,
          elevation: 2,
          borderRadius: 6,
          padding: 10
        }}
      >
        <Header3 color="black" style={{ marginBottom: 10 }}>
          Vuoi parlare con {username}?
        </Header3>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.secondary} />
        ) : (
          <SolidButton
            icon="paper-plane"
            iconSize={20}
            style={{ paddingVertical: 6 }}
            iconStyle={{ color: colors.primary }}
            onPress={() => onContactRequest(objectID, chatID)}
          >
            <Header3 color="primary" style={{ textAlign: "center" }}>
              Chiedi di parlare
            </Header3>
          </SolidButton>
        )}
      </View>
    );
  };
  _getSellerContent = () => {
    const { username, onSettle, objectID, chatID, isLoading } = this.props;

    return (
      <View
        style={{
          backgroundColor: colors.white,
          elevation: 2,
          borderRadius: 6,
          padding: 10
        }}
      >
        <Header3 color="black" style={{ marginBottom: 10 }}>
          {username} vuole iniziare una conversazione con te riguardo questo
          libro!
        </Header3>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.secondary} />
        ) : (
          <View>
            <SolidButton
              icon="times"
              iconSize={20}
              style={{ paddingVertical: 6 }}
              iconStyle={{ color: colors.darkRed }}
              onPress={() => onSettle(objectID, chatID, false)}
            >
              <Header3 color="darkRed" style={{ textAlign: "center" }}>
                Rifiuta
              </Header3>
            </SolidButton>
            <SolidButton
              icon="check"
              iconSize={20}
              style={{ paddingVertical: 6 }}
              iconStyle={{ color: colors.primary }}
              onPress={() => onSettle(objectID, chatID, true)}
            >
              <Header3 color="primary" style={{ textAlign: "center" }}>
                Accetta
              </Header3>
            </SolidButton>
          </View>
        )}
      </View>
    );
  };

  render() {
    const { type, status } = this.props;
    if (status == ChatStatus.PENDING && type == ChatType.shopping)
      return this.renderPending();

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          marginHorizontal: 20,
          marginBottom: 10
        }}
      >
        {type === ChatType.sales
          ? this._getSellerContent()
          : this._getBuyerContent()}
      </View>
    );
  }

  renderPending = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center"
        }}
      >
        <ComposerContainer>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Header3 color="black">Richiesta inviata...</Header3>
          </View>
        </ComposerContainer>
      </View>
    );
  };
}

/*
<Header3 color="black" style={{ marginBottom: 10 }}>
            {username} vuole iniziare una conversazione con te riguardo questo
            libro!
          </Header3>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.secondary} />
          ) : (
            <View>
              <SolidButton
                icon="times"
                iconSize={20}
                style={{ paddingVertical: 6 }}
                iconStyle={{ color: colors.darkRed }}
                onPress={() => onSettle(itemID, chatID, false)}
              >
                <Header3 color="darkRed" style={{ textAlign: "center" }}>
                  Rifiuta
                </Header3>
              </SolidButton>
              <SolidButton
                icon="check"
                iconSize={20}
                style={{ paddingVertical: 6 }}
                iconStyle={{ color: colors.primary }}
                onPress={() => onSettle(itemID, chatID, true)}
              >
                <Header3 color="primary" style={{ textAlign: "center" }}>
                  Accetta
                </Header3>
              </SolidButton>
            </View>
          )}
*/
