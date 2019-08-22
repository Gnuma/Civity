import React, {Fragment} from 'react';
import {StyleSheet, View, Alert, TouchableOpacity} from 'react-native';
import {Text} from './Text';
import ParsedText from 'react-native-parsed-text';
import Settings from './Settings';
import {dispalyTime} from './Timestamp';

export default ({
  item,
  styleMessageContainer,
  userMade,
  styleMessageContent,
  newMessage,
  pressed,
  renderTime: overideRenderTime,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        userMade ? styles.right : styles.left,
        newMessage ? styles.newMessage : null,
        pressed ? styles.pressed : null,
        styleMessageContainer,
      ]}
      onLongPress={onLongPress}>
      <Fragment>
        <MessageText style={[styles.content, styleMessageContent]}>
          {item[Settings.TEXT]}
        </MessageText>
        {overideRenderTime ? overideRenderTime(item) : <TimeSpan item={item} />}
      </Fragment>
    </TouchableOpacity>
  );
};

export const TimeSpan = props => {
  return <Text style={[styles.time]}>{dispalyTime(props.item.timestamp)}</Text>;
};

export const MessageText = ({children, ...rest}) => {
  return (
    <ParsedText {...rest} parse={MESSAGE_PARSER}>
      {children}
    </ParsedText>
  );
};

const OTHER_BACKGROUND_COLOR = '#FFFFFF';
const USER_BACKGROUND_COLOR = '#B2F195';

const styles = StyleSheet.create({
  container: {
    minWidth: 50,
    maxWidth: 300,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginTop: 4,
    borderRadius: 4,
  },
  left: {
    alignSelf: 'flex-start',
    backgroundColor: OTHER_BACKGROUND_COLOR,
  },
  right: {
    alignSelf: 'flex-end',
    backgroundColor: USER_BACKGROUND_COLOR,
  },
  pressed: {
    backgroundColor: '#D1FCFF',
  },
  content: {
    fontSize: 15,
    paddingBottom: 4,
  },
  time: {
    alignSelf: 'flex-end',
    fontSize: 12,
  },
  newMessage: {
    marginTop: 5,
  },

  link: {
    color: '#0645AD',
    textDecorationLine: 'underline',
  },
});

const handleLinkPress = link => Alert.alert(`${link} pressed!`);

const MESSAGE_PARSER = [
  {type: 'url', style: styles.link, onPress: handleLinkPress},
  {type: 'phone', style: styles.link, onPress: handleLinkPress},
  {type: 'email', style: styles.link, onPress: handleLinkPress},
  {pattern: /#(\w+)/, style: styles.link, onPress: handleLinkPress},
];
