import React, { Component } from "react";
import { View, Text, FlatList, ScrollView, Animated } from "react-native";
import PropTypes from "prop-types";
import { Header3, Header2 } from "../Text";
import Button from "../Button";
import _ from "lodash";
import colors from "../../styles/colors";

export class ShoppingTab extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    goTo: PropTypes.func,
    data: PropTypes.object,
    orderedData: PropTypes.array,
    focus: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.layout = {};
    this.mounted = false;
    this.state = {
      barPosition: new Animated.Value(-1),
      barScale: new Animated.Value(0)
    };
  }

  initBar = () => {
    const itemID = this.props.orderedData[this.props.focus].subjectID;
    this.moveBar(itemID);
  };

  moveBar = itemID => {
    this.tabBar.scrollTo({ x: this.layout[itemID].x });
    Animated.timing(this.state.barPosition, {
      toValue: this.layout[itemID].x + this.layout[itemID].width / 2,
      duration: 100,
      useNativeDriver: true
    }).start();
    Animated.timing(this.state.barScale, {
      toValue: this.layout[itemID].width - 40,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  switchTab = (itemID, index) => {
    this.moveBar(itemID);
    this.props.goTo(index);
  };

  render() {
    const { orderedData, focus, data } = this.props;
    return (
      <View
        style={{
          backgroundColor: colors.white,
          //borderBottomLeftRadius: 6,
          //borderBottomRightRadius: 6,
          elevation: 2
        }}
      >
        <ScrollView
          horizontal
          ref={ref => (this.tabBar = ref)}
          style={{ paddingBottom: 10 }}
          centerContent={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row" }}>
            {orderedData.map((item, index) =>
              this._renderItem(data[item.subjectID], index)
            )}
          </View>
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              borderBottomWidth: 2,
              borderColor: colors.primary,
              width: 1,
              transform: [
                {
                  translateX: this.state.barPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                  })
                },
                {
                  scaleX: this.state.barScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                  })
                }
              ]
            }}
          />
        </ScrollView>
      </View>
    );
  }

  _renderItem = (item, index) => {
    return (
      <Button
        onLayout={event => {
          this.layout[item._id] = {
            x: event.nativeEvent.layout.x,
            width: event.nativeEvent.layout.width
          };
          if (
            !this.mounted &&
            _.size(this.layout) === _.size(this.props.orderedData)
          ) {
            this.initBar();
            this.mounted = true;
          }
        }}
        key={item._id}
        onPress={() => this.switchTab(item._id, index)}
        style={{
          paddingHorizontal: 10
        }}
      >
        <Header2 color="black" style={{ marginVertical: 10 }}>
          {item.title}
        </Header2>
        {item.newsCount ? (
          <View
            style={{
              borderBottomWidth: 2,
              borderColor: colors.secondary,
              marginHorizontal: 10
            }}
          />
        ) : null}
      </Button>
    );
  };
}

export default ShoppingTab;
