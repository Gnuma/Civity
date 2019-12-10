import React, {Component} from 'react';
import {Text as RNText, StyleSheet, View} from 'react-native';

export function Text({children, style, ...rest}) {
  return (
    <RNText style={[styles.text, style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: '#000000',
  },
});
