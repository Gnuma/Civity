import React, { PureComponent } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert
} from "react-native";
import PropTypes from "prop-types";
import SystemMessage from "./SystemMessage";
import Settings from "./Settings";
import BubbleContainer from "./BubbleContainer";
import update from "immutability-helper";
import { Text } from "./Text";
import { getFullDate } from "./Timestamp";

export default class MessagesBoard extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object,
    loadEarlier: PropTypes.func,
    loading: PropTypes.bool,
    onBubbleLongPress: PropTypes.func,

    renderBubble: PropTypes.func,
    renderBubbleContainer: PropTypes.func,
    renderSystemMessages: PropTypes.func
  };

  renderItem = ({ item, index }) => {
    const { user: owner, data } = this.props;

    let timestamp = item[Settings.TIMESTAMP];
    const user = item[Settings.USER];
    const system = item[Settings.SYSTEM];

    timestamp = timestamp instanceof Date ? timestamp : new Date(timestamp);
    let showDate = index == data.length - 1;
    if (!showDate) {
      const nextTimestamp =
        data[index + 1][Settings.TIMESTAMP] instanceof Date
          ? data[index + 1][Settings.TIMESTAMP]
          : new Date(data[index + 1][Settings.TIMESTAMP]);

      const currentDate = getFullDate(timestamp);
      const nextDate = getFullDate(nextTimestamp);

      showDate = currentDate !== nextDate;
      if (showDate) console.log(showDate);
    }

    const itemRefactored = update(item, {
      $merge: {
        timestamp
      }
    });

    if (system)
      return this.renderSystemMessage({
        item
      });

    const continuation =
      data[index + 1] &&
      data[index + 1][Settings.USER] &&
      !showDate &&
      data[index + 1][Settings.USER][Settings.USER_ID] ===
        user[Settings.USER_ID];

    return this.renderBubbleContainer({
      ...this.props,
      refresh: showDate,
      item: itemRefactored,
      showDate,
      newMessage: !continuation,
      userMade: owner[Settings.USER_ID] === user[Settings.USER_ID]
    });
  };

  render() {
    const { data, loadEarlier, loading, renderFooter } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.list}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          inverted
          removeClippedSubviews={true}
          keyboardShouldPersistTaps={"always"}
          onEndReachedThreshold={0.25}
          onEndReached={!loading && loadEarlier}
          ListFooterComponent={loading && this.renderLoadingEarlier}
          ListHeaderComponent={renderFooter}
          windowSize={51}
          maxToRenderPerBatch={30}
        />
      </View>
    );
  }

  renderBubbleContainer = props => {
    if (this.props.renderBubbleContainer)
      return this.props.renderBubbleContainer(props);
    else return <BubbleContainer {...props} />;
  };

  renderSystemMessage = props => {
    if (this.props.renderSystemMessage)
      return this.props.renderSystemMessage(props);
    else return <SystemMessage {...props} />;
  };

  renderLoadingEarlier = () => {
    if (this.props.renderLoadingEarlier) this.props.renderLoadingEarlier();
    else
      return <ActivityIndicator style={styles.loadingEarlier} size={"large"} />;
  };

  onLongPress = () => {
    if (this.props.onBubbleLongPress) this.props.onBubbleLongPress();
    else Alert.alert("Pressed");
  };

  keyExtractor = item => item[Settings.MESSAGE_ID].toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    paddingHorizontal: 15
  },
  loadingEarlier: {
    marginVertical: 10,
    alignSelf: "center"
  }
});
