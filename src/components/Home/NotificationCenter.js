import React, { Component } from "react";
import {
  View,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import colors from "../../styles/colors";
import { Header2, Header3, Header4 } from "../Text";
import memoize from "memoize-one";
import SolidButton from "../SolidButton";
import Button from "../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { NCHeight } from "./MainHome";
import _ from "lodash";
import Shadows from "../Shadows";
import { IS_ANDROID } from "../../utils/constants";

export default class NotificationCenter extends Component {
  filter = memoize(data => this.formatNotifications(data));

  _keyExtractor = item => {
    return item.toString();
  };

  _renderItem = ({ item, index }) => {
    const data = this.props.data[item];

    const text = "Hai dei nuovi commenti su ";
    const bookTitle = data.item.book.title;
    return (
      <SolidButton
        style={{
          marginHorizontal: 10,
          marginVertical: 5
        }}
        icon="chevron-circle-right"
        iconSize={20}
        iconStyle={{
          color: colors.secondary
        }}
        onPress={() => this.props.commentHandler(data.item.pk, data.item.book)}
      >
        <Header3 color="black" style={{ fontSize: 17 }} numberOfLines={1}>
          {text}
          <Header3 color="secondary">{bookTitle}</Header3>
        </Header3>
      </SolidButton>
    );
  };

  render() {
    const { data, orderedData, isActive, show } = this.props;
    if (!orderedData || _.isEmpty(orderedData)) return null;

    return (
      <View style={IS_ANDROID ? {} : { zIndex: 2 }}>
        <View
          style={{
            alignItems: "center",
            height: NCHeight,
            justifyContent: "center"
          }}
        >
          <Button
            style={{
              padding: 10,
              borderRadius: 6,
              borderBottom: 0,
              backgroundColor: colors.white,
              ...Shadows[2]
            }}
            onPress={show}
          >
            <Icon name={"bell"} size={24} style={{ color: colors.darkRed }} />
          </Button>
        </View>
        {isActive ? (
          <View>
            <View
              style={{
                position: "absolute",
                marginTop: -10
              }}
            >
              <View
                style={{
                  ...Shadows[2],
                  paddingVertical: 3,
                  marginHorizontal: 20,
                  marginVertical: 4,
                  backgroundColor: colors.white,
                  borderRadius: 6,
                  maxHeight: 300
                }}
              >
                <TouchableWithoutFeedback style={StyleSheet.absoluteFill}>
                  <FlatList
                    renderItem={this._renderItem}
                    data={orderedData}
                    extraData={data}
                    keyExtractor={this._keyExtractor}
                    onStartShouldSetResponderCapture={() => true}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
