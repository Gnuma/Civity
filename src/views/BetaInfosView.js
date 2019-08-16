import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import BetaInfos from "../components/BetaInfos";

export class BetaInfosView extends Component {
  static propTypes = {
    prop: PropTypes
  };

  render() {
    return <BetaInfos goBack={() => this.props.navigation.goBack(null)} />;
  }
}

export default BetaInfosView;
