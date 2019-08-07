import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ItemHeader from "../components/Item/ItemHeader";
import { itemData } from "../mockData/Item";
import MainItem from "../components/Item/MainItem";
import colors from "../styles/colors";
import axios from "axios";
import { ___GET_AD___, ___DELTE_AD___ } from "../store/constants";
import * as commentActions from "../store/actions/comments";
import * as chatActions from "../store/actions/chat";
import * as sellActions from "../store/actions/sell";
import { notificationsViewItem } from "../store/actions/notifications";
import { GreyBar } from "../components/StatusBars";
import { formatOffice } from "../utils/helper";
import DecisionOverlay from "../components/DecisionOverlay";
import LoadingOverlay from "../components/LoadingOverlay";
import { ChatStatus } from "../utils/constants";
import BlockedItemBar from "../components/Item/BlockedItemBar";
import { SafeAreaView, StackActions } from "react-navigation";

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
      loading: false
    };

    this.newComments =
      props.commentsData[props.navigation.getParam("itemID", "Undefined")];
    if (this.newComments) {
      this.newComments = this.newComments.commentsList;
      this.hasNewComments = true;
    } else {
      this.newComments = {};
      this.hasNewComments = false;
    }

    this.viewHeight = 1000;
  }

  componentDidMount() {
    this.keyboardEventListeners = [
      Keyboard.addListener("keyboardDidShow", this.setKeyboardOpen(true)),
      Keyboard.addListener("keyboardDidHide", this.setKeyboardOpen(false))
    ];

    this.loadData();

    /*this.setState({
      data: this.formatData(itemData)
    });*/
  }

  loadData = () => {
    const { navigation } = this.props;
    const id = navigation.getParam("itemID", "Undefined");
    axios
      .get(___GET_AD___ + `${id}/`)
      .then(res => {
        console.log(res.data);
        this.setState({
          data: this.formatData(res.data),
          isOwner: this.props.user.id == res.data.seller._id,
          refreshing: false
        });
        //console.log(res.data);
        console.log(this.formatData(res.data));
        this.props.readComments(id);
      })
      .catch(err => {
        console.log("ERROR", err);
      });
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
      //const res = await axios.get(___DELTE_AD___ + id + "/");
      await this.delay();
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

  componentWillUnmount() {
    this.keyboardEventListeners &&
      this.keyboardEventListeners.forEach(eventListener =>
        eventListener.remove()
      );

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
      loading
    } = this.state;
    const { navigation, isContacted } = this.props;
    const isLoading = data === undefined;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <GreyBar />
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
              />
            )}
            {decision && <DecisionOverlay decision={decision} />}
          </View>
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
    notificationViewItemRedux: itemPK =>
      dispatch(notificationsViewItem(itemPK)),
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
