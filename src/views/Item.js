import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  StatusBar
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ItemHeader from "../components/Item/ItemHeader";
import { itemData } from "../mockData/Item";
import MainItem from "../components/Item/MainItem";
import colors from "../styles/colors";
import axios from "axios";
import {
  ___GET_AD___,
  ___DELTE_AD___,
  ___REPORT_AD___
} from "../store/endpoints";
import * as commentActions from "../store/comments";
import * as chatActions from "../store/chat_Deprecated";
import * as sellActions from "../store/sell";
import { GreyBar, setGreyBar } from "../components/StatusBars";
import { formatOffice } from "../utils/helper";
import DecisionOverlay from "../components/DecisionOverlay";
import LoadingOverlay from "../components/LoadingOverlay";
import { ChatStatus, IS_ANDROID } from "../utils/constants";
import BlockedItemBar from "../components/Item/BlockedItemBar";
import { SafeAreaView, StackActions } from "react-navigation";
import update from "immutability-helper";
import IOSToast from "../components/IOSToast";

export class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      bookName: props.navigation.getParam("name", "Undesfineds"),
      bookAuthors: props.navigation.getParam("authors", "Undesfineds"),
      keyboardOpen: false,
      isOwner: false,
      refreshing: false,
      decision: null,
      loading: false,
      chatSnapshot: 0
    };

    this.viewHeight = 1000;
  }

  componentDidMount() {
    this.viewListeners = [
      Keyboard.addListener("keyboardDidShow", this.setKeyboardOpen(true)),
      Keyboard.addListener("keyboardDidHide", this.setKeyboardOpen(false)),
      this.props.navigation.addListener("willFocus", setGreyBar)
    ];
    setGreyBar();

    this.loadData();

    /*this.setState({
      data: this.formatData(itemData)
    });*/
  }

  loadData = () => {
    const { navigation } = this.props;
    const id = navigation.getParam("itemID", "Undefined");
    this.checkNewMessages(id);
    axios
      .get(___GET_AD___ + `${id}/`)
      .then(res => {
        console.log(res.data);
        this.setState(state =>
          update(state, {
            data: { $set: this.formatData(res.data) },
            isOwner: { $set: this.props.user.id == res.data.seller._id },
            refreshing: { $set: false },
            chatSnapshot: { $apply: chatSnapshot => chatSnapshot + 1 }
          })
        );
        //console.log(res.data);
        console.log(this.formatData(res.data));
        this.props.readComments(id);
      })
      .catch(err => {
        console.log("ERROR", err);
      });
  };

  checkNewMessages = id => {
    this.newComments = this.props.commentsData[id];
    if (this.newComments) {
      this.newComments = this.newComments.commentsList;
      this.hasNewComments = true;
    } else {
      this.newComments = {};
      this.hasNewComments = false;
    }
  };

  takeAction = text =>
    new Promise((resolve, reject) => {
      this.setState({
        decision: {
          resolve,
          reject,
          text
        }
      });
    });

  completeAction = () => {
    this.setState({
      decision: null
    });
  };

  deleteItem = async () => {
    const id = this.state.data.pk;
    try {
      await this.takeAction(
        "Sei sicuro di voler eliminare questa inserzione? Non potrai tornare indietro!"
      );
      this.setState({ decision: null, loading: true });
      const res = await axios.get(___GET_AD___ + id + "/delete/");
      console.log(res);
      //await this.delay();
      this.props.blockItem(id);
      this.props.navigation.pop();
    } catch (error) {
      console.log({ error });
    }
    this.setState({
      decision: null,
      loading: false
    });
  };

  delay = () => new Promise(resolve => setTimeout(resolve, 2000));

  formatData = data => {
    let comments = data.comment_ad;
    const { course, ...restSeller } = data.seller;
    //console.log("NativeComments", comments);
    let formattedComments = [];
    for (let i = 0; i < comments.length; i++) {
      formattedComments.push(this.formatComment(comments[i]));
    }
    return {
      ...data,
      comment_ad: formattedComments,
      seller: {
        office: formatOffice(course),
        ...restSeller
      }
    };
  };

  formatComment = comment => {
    formattedComment = {
      content: comment.text,
      created_at: comment.createdAt,
      pk: comment.pk,
      user: { _id: comment.user._id, ...comment.user.user },
      answers: []
    };
    for (let i = 0; i < comment.parent_child.length; i++) {
      const answer = comment.parent_child[i];
      formattedComment.answers.push({
        content: answer.text,
        created_at: answer.createdAt,
        pk: answer.id,
        user: { _id: answer.user._id, ...answer.user.user }
      });
    }
    return formattedComment;
  };

  reportItem = async () => {
    const id = this.state.data.pk;
    try {
      await this.takeAction("Sei sicuro di voler segnalare questa inserzione?");
      this.setState({ decision: null, loading: true });
      const res = await axios.post(___REPORT_AD___, { id });
      console.log(res);
    } catch (error) {
      console.log({ error });
    }
    this.setState({
      decision: null,
      loading: false
    });
  };

  componentWillUnmount() {
    this.viewListeners &&
      this.viewListeners.forEach(eventListener => eventListener.remove());

    //this.didFocusSubscription && this.didFocusSubscription.remove();
    console.log("Unmounting");
  }

  setKeyboardOpen = value => () => this.setState({ keyboardOpen: value });

  onRefresh = () => {
    this.setState({
      refreshing: true
    });
    this.loadData();
  };

  render() {
    const {
      data,
      bookName,
      bookAuthors,
      isOwner,
      refreshing,
      decision,
      loading,
      chatSnapshot
    } = this.state;
    const { navigation, isContacted } = this.props;
    const isLoading = data === undefined;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <IOSToast>
            <ItemHeader
              handleGoBack={this._handleGoBack}
              title={bookName}
              author={bookAuthors}
              hasNewComments={this.hasNewComments}
              goBack={this._handleGoBack}
            />
            <View style={{ flex: 1 }}>
              {isLoading ? (
                <View
                  style={styles.container}
                  onLayout={event =>
                    (this.viewHeight = event.nativeEvent.layout.height)
                  }
                >
                  <ActivityIndicator size="large" color={colors.secondary} />
                </View>
              ) : (
                <MainItem
                  data={data}
                  user={this.props.user}
                  newComments={this.newComments}
                  onContact={this._handleContact}
                  viewHeight={this.viewHeight}
                  isOwner={isOwner}
                  onRefresh={this.onRefresh}
                  refreshing={refreshing}
                  deleteItem={this.deleteItem}
                  isContacted={isContacted}
                  chatSnapshot={chatSnapshot}
                  reportItem={this.reportItem}
                />
              )}
              {decision && <DecisionOverlay decision={decision} />}
            </View>
          </IOSToast>
        </View>
        {loading && <LoadingOverlay />}
      </SafeAreaView>
    );
  }

  _handleGoBack = () => {
    this.props.navigation.dispatch(StackActions.popToTop());
  };

  _handleContact = () => {
    if (!this.state.isOwner) {
      this.setState({
        loading: true
      });
      this.props
        .contactRedux(this.state.data)
        .then(({ chatID, subjectID }) => {
          console.log(chatID, subjectID);
          this.props.navigation.navigate("ShoppingChat", {
            chatID,
            subjectID
          });
          this.setState({
            loading: false
          });
        })
        .catch(() => {
          this.setState({
            loading: false
          });
        });
    } else {
      this.props.sellStartMofifying(this.state.data);
    }
  };
}

const mapStateToProps = (state, props) => {
  const itemID = props.navigation.getParam("itemID", -1);
  const isContacted = !!state.chat.contactedItems[itemID];
  return {
    user: state.auth.userData
      ? {
          username: state.auth.userData.username,
          id: state.auth.id
        }
      : {},
    commentsData: state.comments.data,
    isContacted
  };
};

const mapDispatchToProps = dispatch => {
  return {
    contactRedux: item => dispatch(chatActions.chatContactUser(item)),
    readComments: item => dispatch(commentActions.commentsRead(item)),
    sellStartMofifying: item => dispatch(sellActions.sellStartModifying(item)),
    blockItem: item => dispatch(chatActions.chatBlockItem(item))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Item);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

//<ImageSlider imgWidth={imageWidth} imgHeight={imageHeight} />
