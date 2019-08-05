import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "../components/Button";
import { SafeAreaView } from "react-navigation";

export class Vendi extends Component {
  render() {
    return (
      <SafeAreaView>
        <Button onPress={() => this.props.navigation.navigate("Camera")}>
          <Text>Camera</Text>
        </Button>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vendi);
