import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import Card from "./Card";
import { Header3 } from "./Text";
import colors from "../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import BooleanButton from "./BooleanButton";

export default class DecisionOverlay extends Component {
  render() {
    const { decision } = this.props;
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center"
            }}
          >
            <View style={styles.opacityOverlay} />
            <Card style={styles.card}>
              <Icon
                name={"question-circle"}
                size={30}
                style={styles.questionIcon}
              />
              <Header3 color="black">{decision.text || ""}</Header3>
              <BooleanButton
                onPress={this.takeDecision}
                containerStyle={styles.booleanButton}
                positiveSize={30}
                negativeSize={30}
              />
            </Card>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  takeDecision = isYes => {
    const { decision } = this.props;
    if (isYes) decision.resolve();
    else decision.reject();
  };
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 101
  },
  opacityOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.5,
    backgroundColor: colors.black
  },
  card: {
    marginHorizontal: 20,
    alignItems: "center"
  },
  questionIcon: {
    color: colors.primary,
    paddingBottom: 5
  },
  booleanButton: {
    marginTop: 10,
    marginBottom: 5
  }
});
