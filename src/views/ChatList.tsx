import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StoreType } from "../store/root";

export class ChatList extends Component {
  static propTypes = {
    prop: PropTypes
  };

  render() {
    return (
      <View>
        <Text> ChatList v3.0.0 </Text>
      </View>
    );
  }
}

const mapStateToProps = (state: StoreType) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
