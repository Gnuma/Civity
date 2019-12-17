import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import StatusLayout, {
  StatusLayoutViewType
} from "../../components/StatusLayout";
import LabeledInput from "../../components/Inputs/LabeledInput";
import update from "immutability-helper";
import {
  ValidatorObject,
  isNotEmpty,
  submit,
  isAvailableUsername,
  usernameLengthValidator,
  isValidEmail,
  isAvailableEmail,
  emailLengthValidator,
  passwordLengthValidator,
  isAvailablePhone,
  phoneLengthValidator
} from "../../utils/validator";
import { Header4 } from "../../components/Text";
import { NavigationStackProp } from "react-navigation-stack";

interface SignupProps {
  navigation: NavigationStackProp;
}

interface SignupState {
  state: SignupStateEnum;
  fields: {
    0: { username: string };
    1: { email: string };
    2: { password: string; confirmPassword: string };
    3: { phone: string };
  };
  warnings: { [key: string]: string };
  loading: boolean;
}

export class Signup extends Component<SignupProps, SignupState> {
  state = {
    state: SignupStateEnum.USERNAME,
    fields: {
      [SignupStateEnum.USERNAME]: { username: "" },
      [SignupStateEnum.EMAIL]: { email: "" },
      [SignupStateEnum.PASSWORD]: { password: "", confirmPassword: "" },
      [SignupStateEnum.PHONE]: { phone: "" }
    },
    warnings: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: ""
    },
    loading: false
  };

  continue = () => {
    const { fields, state } = this.state;
    const fullValidator = update(Validator, {
      2: {
        confirmPassword: { functions: { $push: [this.isConfirmPasswordValid] } }
      }
    });
    this.setState({ loading: true }, () => {
      submit(fields[state], fullValidator[state])
        .then(() => {
          if (state == SignupStateEnum.PHONE) {
            this.signup();
          } else {
            this.setState(state =>
              update(state, {
                state: { $apply: s => s + 1 },
                loading: { $set: false }
              })
            );
          }
        })
        .catch(err => {
          this.setState(state =>
            update(state, {
              warnings: { $merge: err },
              loading: { $set: false }
            })
          );
        });
    });
  };

  signup = () => {
    this.props.navigation.navigate("PhoneValidation");
  };

  renderUsername = () => {
    const { username } = this.state.fields[SignupStateEnum.USERNAME];
    return (
      <LabeledInput
        label="USERNAME"
        value={username}
        warning={this.state.warnings.username}
        onChangeText={text => this.updateField("username", text)}
        autoFocus
      />
    );
  };

  renderEmail = () => {
    const { email } = this.state.fields[SignupStateEnum.EMAIL];
    return (
      <LabeledInput
        label="EMAIL"
        value={email}
        warning={this.state.warnings.email}
        onChangeText={text => this.updateField("email", text)}
        autoFocus
      />
    );
  };

  renderPassword = () => {
    const { confirmPassword, password } = this.state.fields[
      SignupStateEnum.PASSWORD
    ];
    return (
      <View>
        <LabeledInput
          label="PASSWORD"
          value={password}
          warning={this.state.warnings.password}
          onChangeText={text => this.updateField("password", text)}
          textContentType="password"
          secureTextEntry={true}
          autoFocus
        />
        <LabeledInput
          label="CONFIRM PASSWORD"
          value={confirmPassword}
          warning={this.state.warnings.confirmPassword}
          onChangeText={text => this.updateField("confirmPassword", text)}
          containerStyle={{ marginTop: 20 }}
          textContentType="password"
          secureTextEntry={true}
        />
      </View>
    );
  };

  renderPhone = () => {
    const { phone } = this.state.fields[SignupStateEnum.PHONE];
    return (
      <View>
        <LabeledInput
          label="PHONE"
          value={phone}
          warning={this.state.warnings.phone}
          onChangeText={text => this.updateField("phone", text)}
          prefix="+39"
          autoFocus
        />
        <Header4 color="darkGrey" style={{ textAlign: "left", marginTop: 10 }}>
          Il numero verà utilizzato al solo scopo di verificare il tuo account
        </Header4>
      </View>
    );
  };

  updateField = (key: string, value: string) => {
    this.setState(state =>
      update(state, { fields: { [state.state]: { [key]: { $set: value } } } })
    );
  };

  render() {
    const { state, loading } = this.state;
    const views: StatusLayoutViewType[] = [
      { renderView: this.renderUsername, title: "Username" },
      { renderView: this.renderEmail, title: "Email" },
      { renderView: this.renderPassword, title: "Password" },
      { renderView: this.renderPhone, title: "Phone" }
    ];
    return (
      <StatusLayout
        views={views}
        state={state}
        goBack={this.goBack}
        onContinue={this.continue}
        title={"Signup"}
        loading={loading}
      />
    );
  }

  goBack = () => {
    if (this.state.state == 0) this.props.navigation.goBack(null);
    else
      this.setState(state =>
        update(state, {
          state: { $apply: s => Math.max(0, s - 1) }
        })
      );
  };

  isConfirmPasswordValid = () => {
    const { confirmPassword, password } = this.state.fields[2];
    return confirmPassword === password;
  };
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

enum SignupStateEnum {
  USERNAME = 0,
  EMAIL = 1,
  PASSWORD = 2,
  PHONE = 3
}

const Validator: { [key: number]: ValidatorObject } = {
  0: {
    username: {
      functions: [isNotEmpty, isAvailableUsername, usernameLengthValidator],
      warnings: [
        "Inserisici il tuo username",
        "L'username inserito è già stato preso",
        "L'username deve contenere dai 4 ai 13 caratteri"
      ]
    }
  },
  1: {
    email: {
      functions: [
        isNotEmpty,
        isValidEmail,
        isAvailableEmail,
        emailLengthValidator
      ],
      warnings: [
        "Inserisici la tua email",
        "L'email inserita non sembra essere valida",
        "L'email è già stata utilizzata per un altro account",
        "L'email deve contenere massimo 254 caratteri"
      ]
    }
  },
  2: {
    password: {
      functions: [isNotEmpty, passwordLengthValidator],
      warnings: [
        "Scegli una password",
        "La password deve contenere minimo 8 caratteri"
      ]
    },
    confirmPassword: {
      functions: [isNotEmpty],
      warnings: [
        "Conferma la password inserita",
        "La password non coincide con quella inserita"
      ]
    }
  },
  3: {
    phone: {
      functions: [isNotEmpty, isAvailablePhone, phoneLengthValidator],
      warnings: [
        "Inserisci il tuo numero",
        "Il numero inseito è già stato utilizzato per un altro account",
        "Il numero inserito non sembra essere valido"
      ]
    }
  }
};
