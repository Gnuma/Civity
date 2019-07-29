//import PushNotification from "react-native-push-notification";
import { PushNotificationIOS } from "react-native";

const configure = () => {
  PushNotification.configure({
    onRegister: function(token) {
      console.log(token);
    },
    onNotification: function(notification) {
      console.log(notification);
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    senderID: "864359460714",
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },
    popInitialNotification: true,
    requestPermissions: true
  });
};

const localNotification = () => {
  console.log("Sending Local Notification");
  PushNotification.localNotification({
    autoCancel: true,
    bigText: "My big text that will be shown when notification is expanded",
    subText: "This is a subText",
    color: "green",
    vibrate: true,
    vibration: 300,
    title: "Notification Title",
    message: "Notification Message",
    playSound: true,
    soundName: "default",
    actions: '["Accept", "Reject"]'
  });
};

export { configure, localNotification };
