import React, {Component} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import Board from './Board';
import Input from './Input';
import Settings from './Settings';

export default class RNChat extends Component {
  constructor(props) {
    super(props);
    Settings.syntax = props.syntax;
  }

  static propTypes = {
    containerStyle: PropTypes.object,
    data: PropTypes.array.isRequired,
    onSend: PropTypes.func.isRequired,
    syntax: PropTypes.object,

    renderInput: PropTypes.func,
    renderBubbleContainer: PropTypes.func,
    renderSystemMessages: PropTypes.func,
    renderLoadingEarlier: PropTypes.func,
    renderDate: PropTypes.func,
    renderBubble: PropTypes.func,
    renderTime: PropTypes.func,
    renderFooter: PropTypes.func,

    onBubbleLongPress: PropTypes.func,
  };

  renderInput = () => {
    if (this.props.renderInput) return this.props.renderInput(this.props);
    else return <Input {...this.props} />;
  };

  render() {
    const {containerStyle} = this.props;

    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <Board {...this.props} />
        {this.renderInput()}
      </View>
    );
  }
}

RNChat.defaultProps = {
  syntax: {
    message: {},
    user: {},
  },
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
});
