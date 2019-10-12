import React, { Component } from "react";
import { View, StyleSheet, TextStyle, StyleProp } from "react-native";
import PropTypes from "prop-types";
import Button from "./Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { Header1 } from "./Text";
import colors from "../styles/colors";
import NavigationService from "../navigator/NavigationService";
import Shadows from "./Shadows";

interface Props {
  title: string;
  icon?: string;
  goBack?: (keys?: any) => void;
  textStyle?: StyleProp<TextStyle>;
}

class HomeHeader extends Component<Props> {
  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    goBack: PropTypes.func,
    textStyle: PropTypes.object
  };

  static defaultProps = {
    icon: "chevron-left"
  };

  render() {
    const { title, icon, textStyle } = this.props;

    return (
      <View style={Shadows[0]}>
        <View style={styles.container}>
          {icon && (
            <Button onPress={this._local_handleGoBack} style={styles.goBackBtn}>
              <Icon name={icon} size={24} style={styles.backIcon} />
            </Button>
          )}
          <View>
            <Header1 color={"primary"} style={textStyle}>
              {title}
            </Header1>
          </View>
        </View>
      </View>
    );
  }

  _local_handleGoBack = () => {
    (this.props.goBack || NavigationService.goBack)(null);
  };
}

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    ...Shadows[6]
  },
  goBackBtn: {
    padding: 10,
    borderRadius: 4
  },
  backIcon: {
    color: colors.black
  }
});
