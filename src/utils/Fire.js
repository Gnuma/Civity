import firebase from "react-native-firebase";

class Fire {
  constructor() {
    //this.observeAuth();
    this.ref = firebase.firestore().collection("todos");
    //this.unsubscribe = this.ref.onSnapshot(this.update);
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (user) {
    } else {
      firebase
        .auth()
        .signInAnonymously()
        .catch(error => {
          alert(error.message);
        });
    }
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on("child_added", snapshot => callback(this.parse(snapshot)));

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user
    };
    return message;
  };

  off() {
    this.ref.off();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  // 2.
  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // 3.
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      // 4.
      const message = {
        text,
        user,
        timestamp: this.timestamp
      };
      this.append(message);
    }
  };
  // 5.
  append = message => this.ref.push(message);
}

Fire.shared = new Fire();
export default Fire;
