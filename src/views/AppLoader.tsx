import React, { Component } from "react";
import { connect } from "react-redux";
import NavigationService from "../navigator/NavigationService";
import { NavigationSwitchProp } from "react-navigation";
import { StoreType } from "../store/root";
import { GeneralOffice } from "../types/ProfileTypes";
import SplashScreen from "../components/SplashScreen";
import { settingsStartUp } from "../store/settings";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

interface AppLoaderProps {
  navigation: NavigationSwitchProp;
  office?: GeneralOffice;
  token?: string;
  settingsStartUp: () => void;
}

export class AppLoader extends Component<AppLoaderProps> {
  componentDidMount() {
    const { token, office } = this.props;

    this.props.settingsStartUp();
    //Logged in
    if (token) NavigationService.navigate("Home");
    //Anonymous
    else if (office) NavigationService.navigate("Home");
    //First time
    else NavigationService.navigate("InitProfile");
  }

  render() {
    return <SplashScreen />;
  }
}

const mapStateToProps = (state: StoreType) => ({
  token: state.auth.token,
  office: state.auth.office
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  settingsStartUp: () => dispatch(settingsStartUp())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLoader);
