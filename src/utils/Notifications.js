import firebase from "react-native-firebase";
import store from "../store/store";
import NavigationService from "../navigator/NavigationService";
import { ChatType } from "../utils/constants";
import { StackActions, NavigationActions } from "react-navigation";

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
        this.goSalesChat({ itemID: data.objectID, chatID: data._id });
      } else {
        this.goShoppingChat({
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

  goShoppingChat = data =>
    setTimeout(() => {
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: "ShoppingList" }),
          NavigationActions.navigate({
            routeName: "ShoppingChat",
            params: data
          })
        ],
        key: "SHOPPING"
      });
      NavigationService.dispatch(resetAction);
    });

  goSalesChat = data =>
    setTimeout(() => {
      const resetToNav = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "SalesNavigator" })],
        key: "SALES"
      });
      NavigationService.dispatch(resetToNav);
      NavigationService.navigate("SaleChat", data);
    });

  replace = (routeName, data) =>
    setTimeout(() => {
      const replaceAction = StackActions.replace({
        key: routeName,
        routeName: routeName,
        params: data
      });
      NavigationService.dispatch(replaceAction);
    }, 0);

  //---END---HANDLE OPEN NOTIFICATION

  onNotification = notificationData => {
    //Check if chat == Chatt
    console.log(store.getState().chat.chatFocus);
    if (
      notificationData._data._id &&
      store.getState().chat.chatFocus == notificationData._data._id
    )
      return;

    this.displayNotification(notificationData);
  };

  start = async () => {
    //if (!(await this.requestPermisions())) return;
    try {
      const permissions = await firebase.messaging().hasPermission();
      if (!permissions) {
        await firebase.messaging().requestPermission();
      }
    } catch (error) {
      console.log("Permissions rejected", error);
    }
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
