import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { Header3, Header5, Header4 } from "../Text";
import Divider from "../Divider";
import Button from "../Button";

export default class Comment extends Component {
  static propTypes = {
    pk: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    user: PropTypes.object,
    content: PropTypes.string,
    isFather: PropTypes.bool,
    sellerPK: PropTypes.number,
    isPending: PropTypes.bool
  };

  render() {
    const { isFather, answers, userID, sellerPK } = this.props;
    //console.log(this.props);
    return (
      <View>
        {this._renderHeader()}
        {this._renderContent()}
        {isFather ? (
          <View style={{ marginLeft: 12 }}>
            {answers.map(answer => {
              return (
                <Comment
                  {...answer}
                  key={answer.pk}
                  isFather={false}
                  sellerPK={sellerPK}
                  userID={userID}
                />
              );
            })}
          </View>
        ) : null}
      </View>
    );
  }

  _renderHeader = () => {
    const { user, isFather, sellerPK, pk, isPending, userID } = this.props;
    let created_at = new Date(this.props.created_at);
    if (created_at.getTime() > 0)
      created_at =
        created_at.getDate() +
        "/" +
        (created_at.getMonth() + 1) +
        "/" +
        created_at.getFullYear();
    else created_at = this.props.created_at;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <Header3
          color={sellerPK === user._id ? "secondary" : "black"}
          style={{ fontSize: 20, maxWidth: 100 }}
          numberOfLines={1}
        >
          {user.username}
        </Header3>
        <Divider style={{ width: 20, height: 1, marginHorizontal: 4 }} />
        <Header5>{isPending ? "Inviando..." : created_at}</Header5>
        {isFather &&
        (user._id == userID || userID == sellerPK) &&
        !isPending ? (
          <Button
            style={{
              marginHorizontal: 2,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4
            }}
            onPress={() => this.props.onAnswer(pk)}
          >
            <Header4 color="primary">Rispondi</Header4>
          </Button>
        ) : null}
        <View
          style={{ justifyContent: "flex-end", flex: 1, flexDirection: "row" }}
        >
          <Button
            style={{
              marginHorizontal: 2,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4
            }}
          >
            <Header4 color="red">Segnala</Header4>
          </Button>
        </View>
      </View>
    );
  };

  _renderContent = () => {
    const { content, isFather } = this.props;
    return (
      <View style={{ marginLeft: isFather ? 12 : 0 }}>
        <Header3 color={"black"}>{content}</Header3>
      </View>
    );
  };

  _renderAnswers = () => {
    const { answers } = this.props;
  };
}
