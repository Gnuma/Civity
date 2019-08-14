import React, { Component } from "react";
import { View, KeyboardAvoidingView } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BasicHeader from "../components/BasicHeader";
import {
  ChatType,
  ChatStatus,
  OffertStatus,
  KAV_BEHAVIOR
} from "../utils/constants";
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
import InvalidOffert from "../components/BookOffert/InvalidOffert";
import { SafeAreaView } from "react-navigation";
import { setGreyBar } from "../components/StatusBars";
import IOSToast from "../components/IOSToast";

export class BookOffert extends Component {
  constructor(props) {
    super(props);
    this.type = props.navigation.getParam("type", null);
    const objectID = props.navigation.getParam("objectID", null);
    const chatID = props.navigation.getParam("chatID", null);
    this.state = {
      objectID,
      chatID,
      price: String(props.data.item.price || ""),
      decision: null
    };
  }

  static propTypes = {
    //type: PropTypes.string,
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener(
      "willFocus",
      setGreyBar
    );
    setGreyBar();
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

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
  };

  focusPrice = () => this.priceInput && this.priceInput.focus();

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

      case OffertType.INVALID:
        return <InvalidOffert />;

      default:
        return null;
    }
  };

  render() {
    const { decision } = this.state;
    const data = this.props.data;
    console.log(data);
    const { type, title } = getState(
      data,
      data.offert,
      this.props.userID,
      data.item
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1, overflow: "hidden" }}
          behavior={KAV_BEHAVIOR}
        >
          <IOSToast>
            <BasicHeader title={title} />
            <View style={{ flex: 1 }}>
              {this.renderContent(type, data)}
              {data.loading ? <LoadingOverlay /> : null}
              {decision && <DecisionOverlay decision={decision} />}
            </View>
          </IOSToast>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, props) => {
  const type = props.navigation.getParam("type", null);
  const objectID = props.navigation.getParam("objectID", null);
  const chatID = props.navigation.getParam("chatID", null);

  const { UserTO, offerts, statusLoading, status, feedbacks } = state.chat.data[
    objectID
  ].chats[chatID];
  const data = {
    status,
    offert: pickOffert(offerts),
    loading: statusLoading,
    UserTO,
    feedbacks
  };

  if (type == ChatType.sales) {
    const { chats, newsCount, ...itemData } = state.chat.data[objectID];
    data.item = itemData;
    data.type = "seller";
  } else {
    data.item = state.chat.data[objectID].chats[chatID].item;
    data.type = "buyer";
  }

  return {
    data,
    userID: state.auth.id,
    userSeller: {
      ...state.auth.userData,
      user: {
        username: state.auth.userData.username
      },
      office: state.auth.office
    }
  };
};

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
  LOCAL: { type: OffertType.INVALID, title: "Chat locale" },
  PENDING: { type: OffertType.INVALID, title: "In attesa di risposta" },
  REJECTED: { type: OffertType.INVALID, title: "Chat rifiutata" },

  CREATE: { type: OffertType.CREATE, title: "Fai una offerta" },
  EDIT: { type: OffertType.EDIT, title: "Gestisci offerta" },
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
    title: "Inserzione bloccata"
  }
};

export const getState = (data, offert, userID, item) => {
  console.log(data);

  switch (data.status) {
    //Offert has to be pending
    case ChatStatus.LOCAL:
      return OffertStates.LOCAL;
    case ChatStatus.PENDING:
      return OffertStates.PENDING;
    case ChatStatus.REJECTED:
      return OffertStates.REJECTED;

    case ChatStatus.PROGRESS:
      if (!offert) return OffertStates.CREATE;
      if (offert.creator._id == userID) {
        return OffertStates.EDIT;
      } else {
        return OffertStates.DECIDE;
      }
    case ChatStatus.EXCHANGE:
      if (item.seller._id == userID) {
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

export const pickOffert = offerts =>
  !offerts || _.isEmpty(offerts) || offerts[0].status === OffertStatus.REJECTED
    ? undefined
    : offerts[0];
