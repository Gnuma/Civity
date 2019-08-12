import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  ScrollView,
  Keyboard,
  Animated,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Signup from "./Signup";
import Login from "./Login";
import { Header1, Header3 } from "../../components/Text";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { AndroidBackHandler } from "react-navigation-backhandler";
import * as authActions from "../../store/actions/auth";
import LoadingOverlay from "../../components/LoadingOverlay";
import { HiddenBar } from "../../components/StatusBars";
import { mockOffice } from "../../mockData/MockUser";
import {
  StackActions,
  NavigationActions,
  SafeAreaView
} from "react-navigation";
import { NOTCH_MARGIN } from "../../utils/constants";
import Shadows from "../../components/Shadows";

export class Auth extends Component {
  constructor(props) {
    super(props);

    this._resolve = this.props.navigation.getParam("resolve", () => {});
    this._reject = this.props.navigation.getParam("reject", () => {});
  }

  static propTypes = {
    isLoading: PropTypes.bool,
    signupRedux: PropTypes.func,
    loginRedux: PropTypes.func,

    office: PropTypes.object
  };

  state = {
    authType: "signup",
    showFooter: true,
    status: 0,
    isLoading: false
  };

  componentDidMount() {
    this.keyboardEventListeners = [
      Keyboard.addListener("keyboardDidShow", () => {
        this.setState({ showFooter: false });
      }),
      Keyboard.addListener("keyboardDidHide", () => {
        this.setState({ showFooter: true });
      })
    ];
  }

  hideFooter = () => this.setState({ showFooter: false });

  componentWillUnmount() {
    this.keyboardEventListeners &&
      this.keyboardEventListeners.forEach(eventListener =>
        eventListener.remove()
      );
  }

  _goBack = () => {
    if (this.state.status <= 0) {
      this._reject();
      this.props.navigation.goBack(null);
      return true;
    } else {
      this.setState(prevState => ({
        status: prevState.status - 1
      }));
      return true;
    }
  };

  _goNext = () => {
    this.setState(prevState => ({
      status: prevState.status + 1
    }));
  };

  _goChangeOffice = () => {
    this.props.navigation.navigate("OfficeChangeAuth");
  };

  _switchAuthType = () =>
    this.setState(prevState => ({
      authType: prevState.authType === "signup" ? "login" : "signup",
      status: 0
    }));

  goValidation = () => {
    this.props.navigation.replace("PhoneValidation", {
      resolve: this._resolve,
      reject: this._reject
    });
  };

  completeAuth = token => {
    this._resolve(token);
    this.props.navigation.goBack(null);
  };

  setLoading = isLoading => {
    this.setState({
      isLoading
    });
  };

  render() {
    const {
      signupRedux,
      isLoading: isPropsLoading,
      loginRedux,
      serverError,
      office
    } = this.props;
    const { authType, isLoading: isStateLoading } = this.state;

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={NOTCH_MARGIN}
      >
        <AndroidBackHandler
          onBackPress={this._goBack}
          style={StyleSheet.absoluteFill}
        >
          <HiddenBar />
          <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
            <View style={{ marginBottom: 10, flex: 1 }}>
              <View
                style={{
                  marginLeft: -10,
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Button
                  style={{
                    borderRadius: 6
                  }}
                  onPress={this._goBack}
                >
                  <Icon
                    name={this.state.status > 0 ? "chevron-left" : "times"}
                    size={32}
                    style={{ color: "black", padding: 10, borderRadius: 4 }}
                  />
                </Button>
                <Header1 color="primary">
                  {authType == "signup" ? "Registrati" : "Accedi"}
                </Header1>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Header1
                  style={{ fontSize: 50, textAlign: "center" }}
                  color={"primary"}
                >
                  Civity
                </Header1>
              </View>
              {authType === "signup" ? (
                <Signup
                  signup={signupRedux}
                  status={this.state.status}
                  goNext={this._goNext}
                  hideFooter={this.hideFooter}
                  completeAuth={this.completeAuth}
                  office={office}
                  goChangeOffice={this._goChangeOffice}
                  goValidation={this.goValidation}
                  setLoading={this.setLoading}
                />
              ) : (
                <Login
                  login={loginRedux}
                  status={this.state.status}
                  goNext={this._goNext}
                  hideFooter={this.hideFooter}
                  completeAuth={this.completeAuth}
                  goValidation={this.goValidation}
                  setLoading={this.setLoading}
                />
              )}
            </View>
            {this._renderFooter()}
          </SafeAreaView>
          {isPropsLoading || isStateLoading ? (
            <View style={{ ...StyleSheet.absoluteFill, elevation: 10 }}>
              <LoadingOverlay />
            </View>
          ) : null}
        </AndroidBackHandler>
      </KeyboardAvoidingView>
    );
  }

  _renderFooter = () => {
    if (!this.state.showFooter || this.state.status > 0) return null;

    return (
      <View
        style={{
          flex: 1 / 2,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Button onPress={this._switchAuthType}>
          <Header3 color={"primary"}>Hai già un account?</Header3>
        </Button>
      </View>
    );
  };
}

const mapStateToProps = state => ({
  isLoading: state.auth.loading,
  office: state.auth.office //Test,
});

const mapDispatchToProps = dispatch => ({
  loginRedux: (uid, pwd, resolve) =>
    dispatch(authActions.authLogin(uid, pwd, resolve)),
  signupRedux: (uid, email, pwd1, pwd2, resolve) =>
    dispatch(authActions.authSignup(uid, email, pwd1, pwd2, resolve))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

/**
 * <Header3>Oppure</Header3>
        <View
          style={{
            flexDirection: "row",
            width: 230,
            marginVertical: 10,
            justifyContent: "space-evenly"
          }}
        >
          <Button
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#4285F4",
              ...Shadows[2],
              justifyContent: "center",
              borderRadius: 4
            }}
          >
            <Icon
              name="google"
              size={32}
              style={{ alignSelf: "center", color: "white" }}
            />
          </Button>
          <Button
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#3B5998",
              ...Shadows[2],
              justifyContent: "center",
              borderRadius: 4
            }}
          >
            <Icon
              name="facebook"
              size={32}
              style={{ alignSelf: "center", color: "white" }}
            />
          </Button>
        </View>
 */
