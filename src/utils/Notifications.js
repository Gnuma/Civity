import firebase from "react-native-firebase";
import store from "../store/store";

class Notifications {
  constructor() {
    this.channel = new firebase.notifications.Android.Channel(
      "Default Channel",
      "Default Channel",
      firebase.notifications.Android.Importance.High
    ).setDescription("Default Channel");

    // Create the channel
    firebase.notifications().android.createChannel(this.channel);
  }

  onNotification = notificationData => {
    //Check if chat == Chatt
    console.log(store.getState().chat.chatFocus);
    if (store.getState().chat.chatFocus) return;

    this.displayNotification(notificationData);
  };

  openNotification = openAction => {
    console.log(openAction);
  };

  start = async () => {
    //if (!(await this.requestPermisions())) return;
    this.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification =>
        console.log("Notification", notification)
      );

    this.removeNotificationListener = firebase
      .notifications()
      .onNotification(this.onNotification);

    this.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(this.openNotification);
  };

  die() {
    this.removeNotificationDisplayedListener &&
      this.removeNotificationDisplayedListener();
    this.removeNotificationListener && this.removeNotificationListener();
    this.removeNotificationOpenedListener &&
      this.removeNotificationOpenedListener();
  }

  requestPermisions = async () => {
    try {
      const enabled = await firebase.messaging().hasPermission();
      if (!enabled) {
        await firebase.messaging().requestPermission();
      }
      return true;
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  displayNotification = notificationData => {
    console.log("Displaying", notificationData);
    const notification = new firebase.notifications.Notification()
      .setNotificationId(notificationData._notificationId)
      .setTitle(notificationData._title)
      .setBody(notificationData._body)
      .setData(notificationData._data)
      .android.setChannelId(this.channel.channelId)
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .setSound("default");

    firebase.notifications().displayNotification(notification);
  };
}

const notifications = new Notifications();
export default notifications;
