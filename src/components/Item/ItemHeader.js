import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { HeaderStyles as styles } from "./styles";
import Button from "../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header2, Header5 } from "../Text";
import colors from "../../styles/colors";

export default class ItemHeader extends Component {
  static propTypes = {
    handleGoBack: PropTypes.func,
    title: PropTypes.string,
    authors: PropTypes.string,
    hasNewComments: PropTypes.bool
  };

  render() {
    return (
      <View style={{ elevation: 0 }}>
        <View style={styles.container}>
          <Button onPress={this.props.handleGoBack} style={styles.goBack}>
            <Icon
              name="chevron-left"
              size={24}
              style={{ color: colors.black }}
            />
          </Button>
          <View style={styles.contentContainer}>
            <View style={styles.content}>
              <Header2 numberOfLines={1} color={"primary"}>
                {this.props.title}
              </Header2>
              <Header5 numberOfLines={1} style={styles.authors}>
                di {this.props.authors}
              </Header5>
            </View>
            {this.props.hasNewComments ? (
              <Button style={styles.notificationButton} disabled>
                <Icon
                  name={"bell"}
                  size={24}
                  style={{ color: colors.darkRed }}
                />
              </Button>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}
