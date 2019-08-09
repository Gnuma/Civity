import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import Button from "../Button";
import { Header3, Header4 } from "../Text";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Shadows from "../Shadows";

export default class OfficeButton extends Component {
  static propTypes = {
    office: PropTypes.object,
    onPress: PropTypes.func
  };

  render() {
    const { office, onPress } = this.props;

    return (
      <View style={{ margin: 8, flexDirection: "row" }}>
        <View style={{ flex: 1, ...Shadows[0], flexDirection: "row" }}>
          <Button
            onPress={onPress}
            style={{
              flex: 1,
              padding: 8,
              ...Shadows[4],
              backgroundColor: "white",
              borderBottomLeftRadius: 6,
              borderTopLeftRadius: 6,
              flexDirection: "row"
            }}
          >
            {office ? (
              <View style={{ flex: 1 }}>
                <Header3 numberOfLines={2} color="black">
                  {office.name}, {office.course.year}° {office.course.name}
                </Header3>
                <Header4
                  color="black"
                  numberOfLines={1}
                  style={{ marginLeft: 16 }}
                >
                  {office.address}
                </Header4>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Header3>Seleziona ufficio</Header3>
              </View>
            )}
          </Button>
          <Button
            style={{
              width: 50,
              backgroundColor: "white",
              ...Shadows[5],
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6
            }}
            onPress={onPress}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon5 name={"pen"} size={22} />
            </View>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
