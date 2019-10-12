import React, { Component } from "react";
import { Text, StyleSheet, View, ToastAndroid } from "react-native";
import { connect } from "react-redux";
import { Subject, of, Observable, Subscription } from "rxjs";
import { switchMap, delay, map } from "rxjs/operators";
import store from "../store/store";
import { createToast } from "../store/settings";
import { Header3, Header4 } from "./Text";
import Card from "./Card";
import * as Animatable from "react-native-animatable";
import { IS_ANDROID } from "../utils/constants";
import { ToastType } from "../store/settings/types";
import { StoreType } from "../store/root";

const TOAST_TIME = 1500;

interface IOSToastProps {
  toast: ToastType;
  children: React.ReactNode;
}

class IOSToast extends Component<IOSToastProps, { show: boolean }> {
  toastTimeline: Subject<string>;
  subscription?: Subscription;

  constructor(props: IOSToastProps) {
    super(props);
    this.toastTimeline = new Subject<string>();
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    this.subscription = this.toastTimeline
      .pipe(switchMap(toast => of(toast).pipe(delay(TOAST_TIME))))
      .subscribe({
        next: toast => this.setState({ show: false }),
        error: error => console.log(error)
      });
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  componentDidUpdate(prevProps: IOSToastProps) {
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

  static dispatchToast = (toast: string) => {
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

const mapStateToProps = (state: StoreType) => ({
  toast: state.settings.toast
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IOSToast);
