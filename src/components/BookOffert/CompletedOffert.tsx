import React, { Component } from "react";
import { Text, View } from "react-native";
import { OffertInfo, DecisionBox, FullOffertProps } from "./General";
import Card from "../Card";
import { Header2, Header1, Header3 } from "../Text";
import FullButton from "../FullButton";
import {
  FEEDBACK_TYPES,
  TextFeedbackTypes,
  FeedbackOffertTypes
} from "../../utils/constants";
import { GeneralFeedback } from "../../store/chat_Deprecated/types";
import { GeneralUser } from "../../types/ProfileTypes";

interface CompletedOffertProps extends FullOffertProps {
  feedbacks: {
    buyer?: GeneralFeedback;
    seller?: GeneralFeedback;
  };
  type: FeedbackOffertTypes;
  UserTO: GeneralUser;
}

export default ({
  item,
  offert,
  UserTO,
  feedbacks,
  type
}: CompletedOffertProps) => {
  return (
    <View style={{ flex: 1 }}>
      <OffertInfo item={item} user={UserTO} offert={offert}>
        <Header1 color="secondary" style={{ alignSelf: "center" }}>
          Transazione Completata
        </Header1>
        <FeedbackCard
          feedback={feedbacks[type == "seller" ? "buyer" : "seller"]}
          username={UserTO.user.username}
        />
      </OffertInfo>
    </View>
  );
};

interface FeedbackCardProps {
  feedback?: GeneralFeedback;
  username: string;
}
const FeedbackCard = ({ feedback, username }: FeedbackCardProps) => {
  return (
    <Card style={{ marginVertical: 10 }}>
      {feedback ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end"
            }}
          >
            <Header2 color="primary" style={{ flex: 1 }}>
              {username}
              <Header3 color="black"> feedback</Header3>:
            </Header2>
            <Header2
              numberOfLines={1}
              color={
                feedback.judgment == FEEDBACK_TYPES.POSITIVE
                  ? "secondary"
                  : "red"
              }
            >
              {TextFeedbackTypes[feedback.judgment]}
            </Header2>
          </View>
          {feedback.comment && (
            <View style={{ marginTop: 5 }}>
              <Header3 color="black">"{feedback.comment}"</Header3>
            </View>
          )}
        </View>
      ) : (
        <View>
          <Header3 color="black">
            Aspettando il feedback da{" "}
            <Header3 color="primary">{username}...</Header3>
          </Header3>
        </View>
      )}
    </Card>
  );
};
