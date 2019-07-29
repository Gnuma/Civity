import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./styles";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";

export class LeftHeader extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
    handleGoBack: PropTypes.func,
    isItem: PropTypes.bool
  };
  render() {
    const { isActive, isItem, handleGoBack } = this.props;
    if (isActive || isItem) {
      return (
        <Button onPress={handleGoBack}>
          <Icon name="chevron-left" size={24} style={styles.goBack} />
        </Button>
      );
    } else {
      return null;
    }
  }
}

export default LeftHeader;
