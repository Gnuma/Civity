import React, { Component } from "react";
import { View, Keyboard, ToastAndroid, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import CommentComposer from "./CommentComposer";
import { Header2 } from "../Text";
import update from "immutability-helper";
import Comment from "./Comment";
import Divider from "../Divider";
import colors from "../../styles/colors";
import uuid from "uuid";
import axios from "axios";
import { ___CREATE_COMMENT___ } from "../../store/constants";
import protectedAction from "../../utils/protectedAction";
import NetInfo from "@react-native-community/netinfo";

class QuipuComment extends Component {
  static propTypes = {
    data: PropTypes.array,
    sellerPK: PropTypes.number,
    scrollTo: PropTypes.func,
    newComments: PropTypes.object,
    chatSnapshot: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.commentsPosition = {};
    this.commentsCreated = 0;

    this.mainCommentQueue = 0;

    this.state = {
      value: "",
      answeringComment: null,
      answeringValue: "",
      data: props.data ? props.data : []
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chatSnapshot !== this.props.chatSnapshot)
      this.setState({
        value: "",
        answeringComment: null,
        answeringValue: "",
        data: this.props.data ? this.props.data : []
      });
  }

  render() {
    const { value } = this.state;
    return (
      <View>
        {this.props.user.id !== this.props.sellerPK && (
          <CommentComposer
            value={value}
            onTextChange={this._handleComposing}
            onSend={() => this.send("question")}
          />
        )}
        <View>{this.state.data.map(this._renderMainComment)}</View>
      </View>
    );
  }

  _renderMainComment = (mainComment, index) => {
    const hasNews = this.props.newComments[mainComment.pk];
    const isFocused = this.state.answeringComment === mainComment.pk;
    let style = {};
    if (isFocused) {
      style = styles.focusedComment;
    } else if (hasNews) {
      style = styles.newComment;
    }
    return (
      <View
        key={mainComment.pk}
        onLayout={event =>
          this._onCommentLayout(
            mainComment.pk,
            event,
            isFocused && this.state.moveTo
          )
        }
        style={style}
      >
        <Comment
          {...mainComment}
          isFather
          sellerPK={this.props.sellerPK}
          onAnswer={this._onAnswer}
          userID={this.props.user.id}
        />
        {isFocused ? (
          <CommentComposer
            value={this.state.answeringValue}
            onTextChange={this._handleAnswereComposing}
            onSend={() => this.send("answer")}
          />
        ) : null}
        {index !== this.state.data.length - 1 ? (
          <Divider
            style={{ width: 160, marginVertical: 6, alignSelf: "center" }}
          />
        ) : null}
      </View>
    );
  };

  send = type => {
    NetInfo.isConnected
      .fetch()
      .then(isConnected => {
        if (isConnected) {
          if (type === "question") this._onSend();
          else this._onSendAnswer();
        } else {
          ToastAndroid.show(
            "Nessuna connessione ad internet... Riporva più tardi",
            ToastAndroid.SHORT
          );
        }
      })
      .catch(err => {
        ToastAndroid.show(
          "Nessuna connessione ad internet... Riporva più tardi",
          ToastAndroid.SHORT
        );
      });
  };

  _onAnswer = pk => {
    console.log("Position", this.commentsPosition, pk);
    if (this.commentsPosition[pk]) {
      this.setState({
        answeringComment: pk,
        moveTo: true
      });
    } else {
      console.warn("Comment not found");
    }
  };

  _handleAnswereComposing = text => {
    this.setState({
      answeringValue: text
    });
  };

  _onCommentLayout = (pk, event, moveTo) => {
    const layout = event.nativeEvent.layout;
    this.commentsPosition[pk] = layout.y + layout.height;
    if (moveTo)
      this.setState({ moveTo: false }, () =>
        this.props.scrollTo(this.commentsPosition[pk])
      );
  };

  _handleComposing = text => {
    this.setState({
      value: text
    });
  };

  _onSendAnswer = () => {
    const { user } = this.props;
    protectedAction()
      .then(() => {
        for (var i = 0; i < this.state.data.length; i++) {
          if (this.state.answeringComment == this.state.data[i].pk) {
            break;
          }
        }
        const remotefatherPK = this.state.data[i].pk;
        const content = this.state.answeringValue;
        this.setState(
          prevState => ({
            answeringValue: "",
            answeringComment: null,
            data: update(prevState.data, {
              [i]: {
                answers: {
                  $push: [this.composeComment(prevState.answeringValue)]
                }
              }
            })
          }),
          () => {
            const fatherPK = i;
            const childPK = this.state.data[i].answers.length - 1;
            //console.log(fatherPK, childPK);
            axios
              .post(___CREATE_COMMENT___, {
                type: "answer",
                item: remotefatherPK,
                content: content
              })
              .then(res => {
                console.log(res);
                this.sendingConfirmation(fatherPK, childPK, {
                  pk: res.data.pk,
                  created_at: res.data.timestamp
                  //content
                });
              })
              .catch(err => console.log(err.response));

            this.commentsCreated++;
            Keyboard.dismiss();
          }
        );
      })
      .catch(() => {
        console.log("Not logged in");
      });
  };

  _onSend = () => {
    const { user } = this.props;
    const content = this.state.value;
    protectedAction()
      .then(() => {
        if (this.props.user.id === this.props.sellerPK) {
          ToastAndroid.show(
            "Non puoi creare delle domande alle tue inserzioni",
            ToastAndroid.SHORT
          );
        } else {
          this.mainCommentQueue++;
          //console.log(this.mainCommentQueue);
          this.setState(
            prevState => ({
              value: "",
              data: update(prevState.data, {
                $unshift: [this.composeComment(prevState.value)]
              })
            }),
            () => {
              //send validation
              console.log("Creating Comment: ", {
                type: "comment",
                item: this.props.itemPK,
                content: content
              });
              axios
                .post(___CREATE_COMMENT___, {
                  type: "comment",
                  item: this.props.itemPK,
                  content: content
                })
                .then(res => {
                  console.log(res);
                  this.sendingConfirmation(0, null, {
                    pk: res.data.pk,
                    created_at: res.data.timestamp
                    //content
                  });
                })
                .catch(err => {
                  console.warn(err);
                  console.log(err.response);
                });

              this.commentsCreated++;
              Keyboard.dismiss();
            }
          );
        }
      })
      .catch(() => {
        console.log("Not logged in");
      });
  };

  composeComment = content => {
    return {
      pk: -this.commentsCreated,
      user: {
        username: this.props.user.username,
        id: this.props.user.pk
      },
      content,
      created_at: undefined,
      answers: [],
      isPending: true
    };
  };

  sendingConfirmation = (fatherPK, childPK, comment) => {
    //console.log(fatherPK, childPK, comment);
    this.mainCommentQueue = Math.max(0, this.mainCommentQueue - 1);
    if (childPK !== null) {
      this.setState(prevState => ({
        data: update(prevState.data, {
          [fatherPK + this.mainCommentQueue]: {
            answers: {
              [childPK]: {
                $merge: {
                  ...comment,
                  isPending: false
                }
              }
            }
          }
        })
      }));
    } else {
      //console.log("Setting Father comment", comment, fatherPK);
      this.setState(prevState => ({
        data: update(prevState.data, {
          [fatherPK + this.mainCommentQueue]: {
            $merge: {
              ...comment,
              isPending: false
            }
          }
        })
      }));
    }
  };
}

export default QuipuComment;

const styles = StyleSheet.create({
  focusedComment: {
    borderColor: colors.secondary,
    borderWidth: 2,
    padding: 4,
    borderRadius: 6
  },
  newComment: {
    borderColor: colors.darkRed,
    borderLeftWidth: 2,
    padding: 2
  }
});
