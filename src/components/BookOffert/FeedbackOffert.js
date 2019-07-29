import React, { Component } from "react";
import { Text, StyleSheet, View, ToastAndroid } from "react-native";
import { OffertInfo, DecisionBox } from "./General";
import Card from "../Card";
import { Header3, Header2, Header1 } from "../Text";
import FullButton from "../FullButton";
import CheckBox from "../Form/CheckBox";
import Divider from "../Divider";
import { TextInput } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import Button from "../Button";
import { FEEDBACK_TYPES } from "../../utils/constants";

export default class FeedbackOffert extends Component {
  state = {
    feedback: null, //1: positive; 0: negative
    positiveComment: "",
    negativeComment: ""
  };

  selectOption = feedback => {
    this.setState({
      feedback
    });
  };

  onChangeText = (key, text) => {
    this.setState({
      [key]: text
    });
  };

  sendFeedback = () => {
    const { feedback, positiveComment, negativeComment } = this.state;
    if (feedback == null) {
      return ToastAndroid.show("Seleziona il feedback", ToastAndroid.LONG);
    }
    if (feedback == FEEDBACK_TYPES.NEGATIVE && !negativeComment) {
      return ToastAndroid.show(
        "Devi scrivere un commento per lasciare un feedback negativo",
        ToastAndroid.LONG
      );
    }
    this.props.sendFeedback(
      feedback,
      feedback == FEEDBACK_TYPES.POSITIVE ? positiveComment : negativeComment
    );
  };

  render() {
    const { item, offert, UserTO } = this.props;
    const { feedback, positiveComment, negativeComment } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <OffertInfo item={item} user={UserTO}>
          <View style={{ marginBottom: 20 }}>
            <Header3 color="primary">
              Come è andata la transazione con FAKE TEST?
            </Header3>
            <Button
              style={styles.optionRow}
              onPress={() => this.selectOption(FEEDBACK_TYPES.POSITIVE)}
            >
              <CheckBox active={feedback == FEEDBACK_TYPES.POSITIVE} />
              <Header2 color="black" style={{ marginLeft: 10, flex: 1 }}>
                Positiva
              </Header2>
            </Button>
            <UnderlinedInput
              placeholder={
                "(Opzionale) Tutto bene? Fallo sapere al tuo venditore."
              }
              visible={feedback == FEEDBACK_TYPES.POSITIVE}
              autoFocus
              onChangeText={text => this.onChangeText("positiveComment", text)}
              value={positiveComment}
            />
            <Button
              style={styles.optionRow}
              onPress={() => this.selectOption(FEEDBACK_TYPES.NEGATIVE)}
            >
              <CheckBox active={feedback == FEEDBACK_TYPES.NEGATIVE} />
              <Header2 color="black" style={{ marginLeft: 10, flex: 1 }}>
                Negativa
              </Header2>
            </Button>
            <UnderlinedInput
              placeholder={
                "(Richiesto) Spiegaci perchè la transazione è andata male."
              }
              visible={feedback == FEEDBACK_TYPES.NEGATIVE}
              autoFocus
              onChangeText={text => this.onChangeText("negativeComment", text)}
              value={negativeComment}
            />
          </View>
        </OffertInfo>
        <DecisionBox>
          <FullButton
            value="Lascia feedback"
            onPress={this.sendFeedback}
            icon="send"
            style={{ marginBottom: 6 }}
            contentStyle={{ flex: 1, textAlign: "center" }}
          />
        </DecisionBox>
      </View>
    );
  }
}

class UnderlinedInput extends Component {
  state = {
    focused: false
  };
  setFocused = focused => {
    this.setState({ focused });
  };

  render() {
    const { visible, setRef, ...rest } = this.props;
    const { focused } = this.state;
    return (
      <View
        style={[
          styles.underlinedInputContainer,
          focused && styles.underlinedInputContainerFocused
        ]}
      >
        {visible && (
          <TextInput
            style={[styles.underlinedInput]}
            ref={setRef}
            {...rest}
            multiline
            onFocus={() => this.setFocused(true)}
            onBlur={() => this.setFocused(false)}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: "row",
    paddingVertical: 20,
    alignItems: "center",
    paddingLeft: 10
  },
  underlinedInputContainer: {
    borderBottomColor: "#C8C8C8",
    borderBottomWidth: 1
  },
  underlinedInputContainerFocused: {
    borderBottomColor: colors.secondary
  },
  underlinedInput: {
    margin: 0,
    padding: 4,
    color: colors.black,
    fontSize: 18
  }
});
