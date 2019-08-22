import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from './Text';
import Settings from './Settings';

export default ({item, styleSystemMessage, ...rest}) => {
  const text = item[Settings.TEXT];
  return (
    <Text style={[styles.systemMessage, styleSystemMessage]} {...rest}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  systemMessage: {
    textAlign: 'center',
    fontSize: 13,
    color: '#303030',
    alignSelf: 'center',
    marginVertical: 5,
  },
});
