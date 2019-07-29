import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";

import NavigationService from "../navigator/NavigationService";
import protectedAction from "../utils/protectedAction";

export class RightHeader extends Component {
  static propTypes = {
    setActive: PropTypes.func,
    openSettings: PropTypes.func
  };
  render() {
    const { setActive, visible } = this.props;
    if (visible) {
      return (
        <View style={styles.rightHeaderContainer}>
          <Button
            onPress={this.props.openSettings}
            style={{ marginRight: 4, padding: 10, borderRadius: 6 }}
          >
            <Icon name="gear" size={24} style={styles.icon} />
          </Button>
        </View>
      );
    } else {
      return null;
    }
  }
}

export default RightHeader;
