import React, { Component } from "react";
import { Text, StyleSheet, View, ToastAndroid } from "react-native";
import { connect } from "react-redux";
import { Subject, of } from "rxjs";
import { switchMap, delay, map } from "rxjs/operators";
import store from "../store/store";
import { createToast } from "../store/settings";
import { Header3, Header4 } from "./Text";
import Card from "./Card";
import * as Animatable from "react-native-animatable";
import { IS_ANDROID } from "../utils/constants";

const TOAST_TIME = 1500;

class IOSToast extends Component {
  constructor(props) {
    super(props);
    this.toastTimeline = new Subject().pipe(
      switchMap(toast => of(toast).pipe(delay(TOAST_TIME)))
    );
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    this.subscription = this.toastTimeline.subscribe({
      next: toast => this.setState({ show: false }),
      error: error => console.log(error)
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.toast.snapshot !== this.props.toast.snapshot) {
      this.setState({ show: true });
      this.toastTimeline.next(this.props.toast.text);
    }
  }

  render() {
    const { children } = this.props;
    const { show } = this.state;
    return (
      <View style={StyleSheet.absoluteFill}>
        {children}
        {show && (
          <Animatable.View
            animation="zoomInUp"
            style={styles.container}
            pointerEvents="none"
          >
            <Card style={styles.contentContainer}>
              <Header4>{this.props.toast.text}</Header4>
            </Card>
          </Animatable.View>
        )}
      </View>
    );
  }

  static dispatchToast = toast => {
    if (IS_ANDROID) ToastAndroid.show(toast, ToastAndroid.SHORT);
    else store.dispatch(createToast(toast));
  };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    right: 10,
    left: 10
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => ({
  toast: state.settings.toast
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IOSToast);
