import React, { Component } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as authActions from "../store/actions/auth";
import { Header1, Header3, Header2 } from "../components/Text";
import OfficePicker, { canStateContinue } from "../components/OfficePicker";
import { ___OFFICE_HINTS_ENDPOINT___ } from "../store/constants";
import { AndroidBackHandler } from "react-navigation-backhandler";
import { SafeAreaView } from "react-navigation";
import FullButton from "../components/FullButton";
import colors from "../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import BetaInfos from "../components/BetaInfos";
import { KAV_BEHAVIOR } from "../utils/constants";

export class InitProfile extends Component {
  state = {
    status: 0, //0: office, 1: course | class, 2: year,
    office: {},
    course: {},
    year: undefined,

    //BETA
    showBetaInfo: true
  };

  setItem = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  continue = () => {
    const { status } = this.state;
    if (canStateContinue(this.state)) {
      switch (status) {
        case 0:
          this.setState(_ => ({ status: _.status + 1 }));
          break;
        case 1:
          this.setState(_ => ({ status: _.status + 1 }));
          break;
        default:
          this.complete();
          break;
      }
    }
  };

  goBack = () => {
    if (this.state.status === 0) {
      this.props.navigation.goBack(null);
    } else {
      this.setState(prevState => ({
        status: Math.max(0, prevState.status - 1)
      }));
    }
    return true;
  };

  complete = () => {
    if (
      this.state.office != undefined &&
      this.state.year != undefined &&
      this.state.course != undefined
    ) {
      const office = {
        ...this.state.office,
        course: {
          ...this.state.course,
          year: this.state.year
        }
      };
      this.props.appInitRedux(office);
      this.props.navigation.navigate("App");
    }
  };

  render() {
    const { office, course, year, status, showBetaInfo } = this.state;
    //if (showBetaInfo) return this.showBetaInfo();

    const canContinue = canStateContinue(this.state);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AndroidBackHandler onBackPress={this.goBack}>
          <KeyboardAvoidingView
            style={{ flex: 1, paddingHorizontal: 18 }}
            behavior={KAV_BEHAVIOR}
          >
            <ScrollView keyboardShouldPersistTaps="always">
              <View style={{ flex: 1, paddingTop: 20, paddingBottom: 100 }}>
                <Header1 color={"primary"} style={{ fontSize: 50 }}>
                  Ciao!
                </Header1>
                <Header3 color={"black"} style={{ marginBottom: 5 }}>
                  Benvenuto in Civity
                </Header3>
                <Header3 color={"black"}>
                  Per rendere la tua esperienza impeccabile abbiamo bisogno di
                  sapere il tuo istituto
                </Header3>
                <OfficePicker
                  office={office}
                  course={course}
                  year={year}
                  setOffice={office => this.setItem("office", office)}
                  setCourse={course => this.setItem("course", course)}
                  setYear={year => this.setItem("year", year)}
                  status={status}
                  goBack={this.goBack}
                />
              </View>
            </ScrollView>
            <View style={{ marginVertical: 10 }}>
              <FullButton
                value={"Continua"}
                onPress={this.continue}
                icon={canContinue == "Salva" ? "pen" : "chevron-right"}
                iconStyle={{
                  color: canContinue ? colors.white : colors.black
                }}
                contentStyle={{
                  flex: 1,
                  textAlign: "center",
                  color: canContinue ? colors.white : colors.black
                }}
                color={canContinue ? "secondary" : "white"}
                disabled={!canContinue}
              />
            </View>
          </KeyboardAvoidingView>
        </AndroidBackHandler>
      </SafeAreaView>
    );
  }

  showBetaInfo = () => {
    return <BetaInfos onPress={this.goApp} />;
  };

  goApp = () => {
    this.setState({
      showBetaInfo: false
    });
  };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    appInitRedux: office => dispatch(authActions.authAppInit(office, true))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InitProfile);
