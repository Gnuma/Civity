import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as authActions from "../../store/actions/auth";
import BasicHeader from "../../components/BasicHeader";
import PhonePicker, { RetrySend } from "../../components/PhonePicker";
import SolidButton from "../../components/SolidButton";
import { Header3 } from "../../components/Text";
import { AndroidBackHandler } from "react-navigation-backhandler";
import {
  StackActions,
  NavigationActions,
  SafeAreaView
} from "react-navigation";
import ErrorMessage from "../../components/Form/ErrorMessage";
import { getNumber, submit, isPhoneTaken } from "../../utils/validator";
import {
  ___SEND_MESSAGE___,
  ___VALIDATE_USER___,
  ___SEND_VALIDATION___
} from "../../store/constants";
import FullButton from "../../components/FullButton";
import colors from "../../styles/colors";
import { isEmpty } from "rxjs/operators";
import axios from "axios";
import { CODE_LENGTH } from "../../utils/constants";

export class PhoneChange extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      phone: props.phone.toString(),
      status: props.isActive ? 0 : 1,
      code: ["", "", "", "", "", ""],
      loading: false,
      error: ""
    };
  }

  quit = () => {
    this.props.navigation.goBack(null);
  };

  continue = async () => {
    let { status, phone, code } = this.state;
    if (status === 0) {
      //API
      this.setState({
        loading: true
      });
      phone = getNumber(phone);
      const validators = {
        phone: {
          functions: [isEmpty],
          warnings: ["Inserisci il tuo numero di telefono"]
        }
      };
      if (phone != this.props.phone) {
        validators.phone.functions.push(isPhoneTaken);
        validators.phone.warnings.push(
          "Il telefono è già utilizzato per un altro account"
        );
      }
      const result = await submit(
        { phone: { value: phone, errorMessage: "" } },
        validators
      );
      if (result !== true) {
        this.setState({
          loading: false,
          error: result.phone.errorMessage
        });
        return;
      }
      axios
        .post(___SEND_VALIDATION___, {
          phone
        })
        .then(res => {
          console.log(res);
          this.props.setPhone(phone);
          this.setState({
            loading: false,
            status: 1,
            code: ["", "", "", "", "", ""],
            phone,
            error: ""
          });
        })
        .catch(err => {
          console.log({ err });
          this.setState({
            loading: false,
            error: "Errore nel invio dei dati"
          });
        });
    } else {
      //API
      this.setState({
        loading: true
      });
      axios
        .post(___VALIDATE_USER___, {
          phone,
          key: code.join("")
        })
        .then(res => {
          this.props.validate().then(() => {
            this.setState({
              loading: false
            });
            this.quit();
          });
          console.log(res);
        })
        .catch(err => {
          console.log({ err });
          this.setState({
            loading: false,
            error: "Il codice inserito non è valido"
          });
        });
    }
  };

  retrySend = () => this.setState({ status: 0, error: "" });

  canContinue = status => {
    if (status === 0) {
      return this.state.phone.length > 0;
    } else {
      let code = this.state.code.join("");
      code = code.replace(/\s/g, "");
      return code.length === CODE_LENGTH;
    }
  };

  changePhoneText = text => this.setState({ phone: text });

  changeCodeValue = code => this.setState({ code });

  goBack = () => {
    if (this.state.status === 0) {
      this.props.navigation.goBack(null);
    } else {
      this.setState(prevState => ({
        status: Math.max(0, prevState.status - 1),
        error: ""
      }));
    }
    return true;
  };

  render() {
    const { phone, status, code, error } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AndroidBackHandler onBackPress={this.goBack}>
          <View style={{ flex: 1 }}>
            <BasicHeader title="Modifica il numero" goBack={this.goBack} />
            <View style={{ flex: 1, marginHorizontal: 20 }}>
              <ScrollView keyboardShouldPersistTaps="always">
                <PhonePicker
                  phone={phone}
                  status={status}
                  changePhoneText={this.changePhoneText}
                  code={code}
                  changeCodeValue={this.changeCodeValue}
                  retrySend={this.retrySend}
                />
                {!!error && <ErrorMessage message={error} />}
                {status === 1 && <RetrySend retrySend={this.retrySend} />}
              </ScrollView>
            </View>
            <ContinueButton
              onPress={this.continue}
              text={status == 0 ? "Invia codice" : "Verifica il numero"}
              active={this.canContinue(status)}
            />
          </View>
        </AndroidBackHandler>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  phone: state.auth.userData.phone,
  isActive: state.auth.isActive
});

const mapDispatchToProps = dispatch => ({
  setPhone: phone => dispatch(authActions.authSetPhone(phone)),
  validate: () => dispatch(authActions.authValidateAccount())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneChange);

const ContinueButton = ({ onPress, active, text }) => {
  console.log(active);
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 20
      }}
    >
      <FullButton
        onPress={onPress}
        value={text}
        icon={active == "Verifica il numero" ? "check" : "send"}
        iconStyle={{
          color: active ? colors.white : colors.black
        }}
        contentStyle={{
          flex: 1,
          textAlign: "center",
          color: active ? colors.white : colors.black
        }}
        color={active ? "secondary" : "white"}
        disabled={!active}
      />
    </View>
  );
};
