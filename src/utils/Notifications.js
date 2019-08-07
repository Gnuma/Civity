import firebase from "react-native-firebase";
import store from "../store/store";
import NavigationService from "../navigator/NavigationService";
import { ChatType } from "../utils/constants";

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

  //---START---HANDLE OPEN NOTIFICATION

  openNotification = openAction => {
    const data = openAction.notification._data;
    if (data.objectID) {
      console.log(data);
      if (data.for === "sale") {
        this.navigate("SaleChat", {
          itemID: data.objectID,
          chatID: data._id
        });
      } else {
        this.navigate("ShoppingChat", {
          subjectID: "s" + data.objectID,
          chatID: data._id
        });
      }
    } else {
      this.navigate("SEARCH");
    }
  };

  navigate = (routeName, data) =>
    setTimeout(() => NavigationService.navigate(routeName, data), 0);

  //---END---HANDLE OPEN NOTIFICATION

  onNotification = notificationData => {
    //Check if chat == Chatt
    console.log(store.getState().chat.chatFocus);
    if (store.getState().chat.chatFocus) return;

    this.displayNotification(notificationData);
  };

  start = async () => {
    //if (!(await this.requestPermisions())) return;
    this.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        //console.log("Notification", notification)
      });

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
      .setSound("default")
      .android.setChannelId(this.channel.channelId)
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .android.setAutoCancel(true)
      .android.setCategory(firebase.notifications.Android.Category.Alarm);

    firebase.notifications().displayNotification(notification);
  };
}

const notifications = new Notifications();
export default notifications;
