import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from "react-navigation";
import Button from "../../components/Button";

interface SelectBooksProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
export default class SelectBooks extends Component<SelectBooksProps> {
  render() {
    return (
      <View>
        <Button onPress={() => this.props.navigation.navigate("PhotosList")}>
          <Text>"Photos example"</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
