import React, {Component} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from './Text';
import uuid from 'uuid';
import Settings from './Settings';

export default class Input extends Component {
  static propTypes = {
    onSend: PropTypes.func,
    text: PropTypes.any,
    onChangeText: PropTypes.func,

    user: PropTypes.object,
    persistTextOnSubmit: PropTypes.bool,
  };

  state = {
    value: '',
  };

  onSend = () => {
    const value = String(this.props.text || this.state.value).trim();
    value &&
      this.props.onSend({
        [Settings.USER]: this.props.user,
        [Settings.MESSAGE_ID]: uuid.v4(),
        [Settings.TEXT]: value,
        [Settings.TIMESTAMP]: new Date(),
      });
    if (!this.props.persistKeyboardOnSubmit) {
      Keyboard.dismiss();
      this.setState({
        value: '',
      });
    }
  };

  onChangeText = value =>
    this.props.onChangeText
      ? this.props.onChangeText(value)
      : this.setState({value});

  render() {
    const {value} = this.state;
    const {text} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <ScrollView style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              multiline
              placeholder={'Send a message'}
              value={text || value}
              onChangeText={this.onChangeText}
            />
          </ScrollView>
          <TouchableOpacity style={styles.btn} onPress={this.onSend}>
            <Text style={styles.btnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  toolbar: {
    marginVertical: 8,
    marginHorizontal: 8,
    padding: 6,
    flexDirection: 'row',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  btnText: {
    fontSize: 14,
    color: '#0645AD',
  },
  btn: {
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 4,
  },
  inputContainer: {
    maxHeight: 200,
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 17,
    padding: 0,
  },
});
