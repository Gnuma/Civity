import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "../components/Button";

export class Vendi extends Component {
  render() {
    return (
      <View>
        <Button onPress={() => this.props.navigation.navigate("Camera")}>
          <Text>Camera</Text>
        </Button>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vendi);
