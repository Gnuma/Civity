import React, { Component } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text } from "react-native";
import PropTypes from "prop-types";
import Timestamp from "./Timestamp";
import Bubble from "./Bubble";
import Settings from "./Settings";

export default class BubbleContainer extends Component {
  static propTypes = {
    item: PropTypes.object,
    showDate: PropTypes.bool,
    newMessage: PropTypes.bool,
    userMade: PropTypes.bool,

    renderBubble: PropTypes.func,
    renderTime: PropTypes.func
  };

  state = {
    pressed: false
  };

  shouldComponentUpdate = (_, prevState) =>
    prevState.pressed !== this.state.pressed;

  renderBubble = props => {
    props = {
      ...props,
      styleBubble: props.styleBubble[props.userMade ? "right" : "left"]
    };
    if (this.props.renderBubble) return this.props.renderBubble(props);
    else return <Bubble {...props} />;
  };

  renderDate = () => {
    if (this.props.renderDate) this.props.renderDate(Timestamp);
    else return <Timestamp timestamp={this.props.item.timestamp} />;
  };

  render() {
    const { item, showDate, newMessage, userMade, onLongPress } = this.props;
    const { pressed } = this.state;

    return (
      <View style={styles.container}>
        {showDate && this.renderDate()}
        <View>
          {this.renderBubble({
            ...this.props,
            item: item,
            userMade: userMade,
            newMessage: newMessage,
            pressed: pressed,
            renderTime: this.props.renderTime,
            onLongPress: onLongPress
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15
  }
});

BubbleContainer.defaultProps = {
  styleBubble: {}
};
