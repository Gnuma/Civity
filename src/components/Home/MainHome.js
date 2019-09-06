import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Easing
} from "react-native";
import SearchLink from "./SearchLink";
import NotificationCenter from "./NotificationCenter";
import BookShelf from "./BookShelf";
import _ from "lodash";
import colors from "../../styles/colors";
import Shadows from "../Shadows";
import { Header3 } from "../Text";

export default class MainHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      NCLayout: null,
      NCActive: false,
      initAnimation: new Animated.Value(props.containerLayout ? 0 : 1)
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.containerLayout && this.props.containerLayout) {
      Animated.timing(this.state.initAnimation, {
        duration: 400,
        toValue: 0,
        easing: Easing.ease,
        useNativeDriver: true
      }).start();
    }
  }

  showNC = () => this.setState({ NCActive: true });
  hideNC = () => this.setState({ NCActive: false });

  render() {
    const {
      openSearchBar,
      commentsOrdered,
      commentsData,
      goComment,
      searchOption,
      containerLayout
    } = this.props;

    return (
      <TouchableWithoutFeedback
        style={StyleSheet.absoluteFill}
        onPress={this.hideNC}
      >
        <View style={{ flex: 1 }}>
          <SearchLink
            containerStyle={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 15,
              paddingHorizontal: 20,
              ...Shadows[0]
            }}
            onPress={openSearchBar}
          />
          <View
            style={{ flex: 1, marginBottom: 10 }}
            onLayout={this.props.setContainerLayout}
          >
            <NotificationCenter
              data={commentsData}
              orderedData={commentsOrdered}
              commentHandler={goComment}
              isActive={this.state.NCActive}
              show={this.showNC}
            />
            <View
              style={{ flex: 1 }}
              pointerEvents={this.state.NCActive ? "none" : "auto"}
            >
              <BookShelf
                onPress={searchOption}
                containerLayout={containerLayout}
              />
            </View>
          </View>
          <Animated.View
            style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: colors.white,
              opacity: this.state.initAnimation
            }}
            pointerEvents="none"
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  //commentsOrdered && !_.isEmpty(commentsOrdered)

  onNCPlaceholderLayout = event => {
    console.log(event.nativeEvent.layout);
    this.setState({
      NCLayout: event.nativeEvent.layout
    });
  };
}

export const NCHeight = 50;
