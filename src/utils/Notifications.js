import firebase from "react-native-firebase";

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

  start = async () => {
    //if (!(await this.requestPermisions())) return;
    this.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        console.log("Notification", notification);
      });
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification(notificationData => {
        // Process your notification as required
        console.log("Aoo", notificationData);
        const notification = new firebase.notifications.Notification()
          .setNotificationId(notificationData._notificationId)
          .setTitle(notificationData._title)
          .setBody(notificationData._body)
          .setData(notificationData._data)
          .android.setChannelId(this.channel.channelId)
          .android.setPriority(firebase.notifications.Android.Priority.High)
          .setSound("default");

        firebase.notifications().displayNotification(notification);
      });
  };

  die() {
    this.removeNotificationDisplayedListener &&
      this.removeNotificationDisplayedListener();
    this.removeNotificationListener && this.removeNotificationListener();
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
}

const notifications = new Notifications();
export default notifications;
