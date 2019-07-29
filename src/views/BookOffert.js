import React, { Component } from "react";
import { View, ToastAndroid } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BasicHeader from "../components/BasicHeader";
import { ChatType, ChatStatus, OffertStatus } from "../utils/constants";
import * as chatActions from "../store/actions/chat";
import LoadingOverlay from "../components/LoadingOverlay";
import { OffertType } from "../utils/constants";
import _ from "lodash";

import CreateOffert from "../components/BookOffert/CreateOffert";
import DecideOffert from "../components/BookOffert/DecideOffert";
import EditOffert from "../components/BookOffert/EditOffert";
import DecisionOverlay from "../components/DecisionOverlay";
import WaitExchangeOffert from "../components/BookOffert/WaitExchangeOffert";
import CompleteExchangeOffert from "../components/BookOffert/CompleteExchangeOffert";
import FeedbackOffert from "../components/BookOffert/FeedbackOffert";
import CompletedOffert from "../components/BookOffert/CompletedOffert";
import BlockedOffert from "../components/BookOffert/BlockedOffert";

export class BookOffert extends Component {
  constructor(props) {
    super(props);
    this.type = props.navigation.getParam("type", null);
    const objectID = props.navigation.getParam("objectID", null);
    const chatID = props.navigation.getParam("chatID", null);
    this.state = {
      objectID,
      chatID,
      price:
        this.type == ChatType.sales
          ? props.data[objectID].price.toString()
          : props.data[objectID].chats[chatID].item.price.toString(),
      decision: null
    };
  }

  static propTypes = {
    //type: PropTypes.string,
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

  createOffert = async () => {
    const { objectID, chatID, price } = this.state;
    try {
      await this.takeAction("Sei sicuro di voler offrire EUR " + price + " ?");
      this.props.chatCreateOffert(objectID, chatID, price);
    } catch (error) {}
    this.completeAction();
  };

  removeOffert = async () => {
    //return ToastAndroid.show("Coming soon...", ToastAndroid.SHORT);
    const { objectID, chatID } = this.state;
    try {
      await this.takeAction("Sei sicuro di voler cancellare questa offerta?");
      this.props.chatCancelOffert(objectID, chatID);
    } catch (error) {}
    this.completeAction();
  };

  rejectOffert = async () => {
    const { objectID, chatID } = this.state;
    try {
      await this.takeAction("Sei sicuro di voler rifiutare l'offerta?");
      this.props.chatRejectOffert(objectID, chatID);
    } catch (error) {}
    this.completeAction();
  };

  acceptOffert = async () => {
    const { objectID, chatID } = this.state;
    try {
      await this.takeAction("Sei sicuro di voler accettare l'offerta?");
      this.props.chatAcceptOffert(objectID, chatID);
    } catch (error) {}
    this.completeAction();
  };

  completeExchange = async () => {
    const { objectID, chatID } = this.state;
    try {
      await this.takeAction(
        "Sei sicuro completare la transazione? Ricorda che una volta completata non potrai più tornare indietro"
      );
      this.props.chatCompleteExchange(objectID, chatID);
    } catch (error) {}
    this.completeAction();
  };

  sendFeedback = async (feedback, comment) => {
    const { objectID, chatID } = this.state;
    try {
      await this.takeAction("Sei sicuro di voler lasciare questo feedback?");
      this.props.chatSendFeedback(objectID, chatID, feedback, comment);
    } catch (error) {}
    this.completeAction();
  };

  setPrice = price => this.setState({ price });

  setPriceRef = ref => {
    this.priceInput = ref;
    console.log(ref);
  };

  focusPrice = () => this.priceInput.focus();

  getData = (props = this.props) => {
    const { objectID, chatID } = this.state;
    //console.log(this.type, props.data[objectID].chats[chatID].offerts);
    if (this.type == ChatType.sales) {
      console.log(props.data[objectID]);
      const { chats, newsCount, ...item } = props.data[objectID];
      const { offerts, statusLoading, status, UserTO, feedbacks } = chats[
        chatID
      ];
      return {
        status,
        item,
        //seller: mockData.item.seller //TEST
        //seller: item.
        offert:
          _.isEmpty(offerts) || offerts[0].status === OffertStatus.REJECTED
            ? undefined
            : offerts[0],
        loading: statusLoading,
        UserTO,
        feedbacks,
        type: "seller"
      };
    } else {
      console.log(props.data[objectID].chats[chatID]);
      const {
        UserTO,
        item,
        offerts,
        statusLoading,
        status,
        feedbacks
      } = props.data[objectID].chats[chatID];
      return {
        status,
        item: {
          ...item,
          seller: UserTO
        },
        offert:
          _.isEmpty(offerts) || offerts[0].status === OffertStatus.REJECTED
            ? undefined
            : offerts[0],
        loading: statusLoading,
        UserTO,
        feedbacks,
        type: "buyer"
      };
    }
  };

  getState = data => {
    console.log(data);
    if (!data.offert) return OffertStates.CREATE;
    switch (data.status) {
      //Offert has to be pending
      case ChatStatus.PROGRESS:
        if (data.offert.creator._id == this.props.userID) {
          return OffertStates.EDIT;
        } else {
          return OffertStates.DECIDE;
        }
      case ChatStatus.EXCHANGE:
        if (data.item.seller._id == this.props.userID) {
          return OffertStates.COMPLETE_EXCHANGE;
        } else {
          return OffertStates.WAIT_EXCHANGE;
        }
      case ChatStatus.FEEDBACK:
        if (!data.feedbacks[data.type]) return OffertStates.SEND_FEEDBACK;
        else return OffertStates.COMPLETED;
      case ChatStatus.COMPLETED:
        return OffertStates.COMPLETED;
      case ChatStatus.BLOCKED:
        return OffertStates.BLOCKED;
    }
  };

  renderContent = (type, data) => {
    console.log(!data.offert, data.offert);
    switch (type) {
      case OffertType.CREATE:
        return (
          <CreateOffert
            {...data}
            price={this.state.price}
            setPrice={this.setPrice}
            setPriceRef={this.setPriceRef}
            focusPrice={this.focusPrice}
            createOffert={this.createOffert}
          />
        );

      case OffertType.EDIT:
        return <EditOffert {...data} removeOffert={this.removeOffert} />;

      case OffertType.DECIDE:
        return (
          <DecideOffert
            {...data}
            rejectOffert={this.rejectOffert}
            acceptOffert={this.acceptOffert}
          />
        );

      case OffertType.WAIT_EXCHANGE:
        return <WaitExchangeOffert {...data} />;

      case OffertType.COMPLETE_EXCHANGE:
        return (
          <CompleteExchangeOffert
            {...data}
            setComplete={this.completeExchange}
          />
        );

      case OffertType.SEND_FEEDBACK:
        return <FeedbackOffert {...data} sendFeedback={this.sendFeedback} />;

      case OffertType.COMPLETED:
        return <CompletedOffert {...data} />;

      case OffertType.BLOCKED:
        return <BlockedOffert {...data} />;

      default:
        return null;
    }
  };

  render() {
    const { decision } = this.state;
    const data = this.getData();
    const { type, title } = this.getState(data);
    console.log(data);

    return (
      <View style={{ flex: 1 }}>
        <BasicHeader title={title} />
        <View style={{ flex: 1 }}>
          {this.renderContent(type, data)}
          {data.loading ? <LoadingOverlay /> : null}
          {decision && <DecisionOverlay decision={decision} />}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  data: state.chat.data,
  userID: state.auth.id,
  userSeller: {
    ...state.auth.userData,
    user: {
      username: state.auth.userData.username
    },
    office: state.auth.office
  }
});

const mapDispatchToProps = dispatch => ({
  //new
  chatCreateOffert: (objectID, chatID, price) =>
    dispatch(chatActions.chatCreateOffert(objectID, chatID, price)),
  chatCancelOffert: (objectID, chatID) =>
    dispatch(chatActions.chatCancelOffert(objectID, chatID)),
  chatRejectOffert: (objectID, chatID) =>
    dispatch(chatActions.chatRejectOffert(objectID, chatID)),
  chatAcceptOffert: (objectID, chatID) =>
    dispatch(chatActions.chatAcceptOffert(objectID, chatID)),
  chatCompleteExchange: (objectID, chatID) =>
    dispatch(chatActions.chatCompleteExchange(objectID, chatID)),
  chatSendFeedback: (objectID, chatID, feedback, comment) =>
    dispatch(chatActions.chatSendFeedback(objectID, chatID, feedback, comment))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookOffert);

const OffertStates = {
  CREATE: { type: OffertType.CREATE, title: "Fai una offerta" },
  EDIT: { type: OffertType.EDIT, title: "La tua offerta" },
  DECIDE: { type: OffertType.DECIDE, title: "Accetta/Declina offerta" },
  COMPLETE_EXCHANGE: {
    type: OffertType.COMPLETE_EXCHANGE,
    title: "Concludi scambio"
  },
  WAIT_EXCHANGE: {
    type: OffertType.WAIT_EXCHANGE,
    title: "Concludi scambio"
  },
  SEND_FEEDBACK: {
    type: OffertType.SEND_FEEDBACK,
    title: "Lascia un feedback"
  },
  COMPLETED: {
    type: OffertType.COMPLETED,
    title: "Completato"
  },
  BLOCKED: {
    type: OffertType.BLOCKED,
    title: "Completato"
  }
};
