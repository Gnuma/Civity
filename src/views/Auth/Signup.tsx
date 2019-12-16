import React, { Component } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import StatusLayout, {
  StatusLayoutViewType
} from "../../components/StatusLayout";
import LabeledInput from "../../components/Inputs/LabeledInput";
import update from "immutability-helper";
import { ValidatorObject, isNotEmpty, submit } from "../../utils/validator";
import { Header3, Header4 } from "../../components/Text";

interface SignupProps {}

interface SignupState {
  state: SignupStateEnum;
  fields: {
    0: { username: string };
    1: { email: string };
    2: { password: string; confirmPassword: string };
    3: { phone: string };
  };
  warnings: { [key: string]: string };
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
    }
  };

  continue = () => {
    const { fields, state } = this.state;
    submit(fields[state], Validator[state])
      .then(() => {
        this.setState(state =>
          update(state, { state: { $apply: s => s + 1 } })
        );
      })
      .catch(err => {
        this.setState(state => update(state, { warnings: { $merge: err } }));
      });
  };

  renderUsername = () => {
    const { username } = this.state.fields[SignupStateEnum.USERNAME];
    return (
      <LabeledInput
        label="USERNAME"
        value={username}
        warning={this.state.warnings.username}
        onChangeText={text => this.updateField("username", text)}
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
        />
        <LabeledInput
          label="CONFIRM PASSWORD"
          value={confirmPassword}
          warning={this.state.warnings.confirmPassword}
          onChangeText={text => this.updateField("confirmPassword", text)}
          containerStyle={{ marginTop: 20 }}
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
        />
        <Header4
          color="darkGrey"
          style={{ textAlign: "center", marginTop: 10 }}
        >
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
    const { state } = this.state;
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
      />
    );
  }

  goBack = () => {};
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
      functions: [isNotEmpty],
      warnings: ["Inserisici il tuo username"]
    }
  },
  1: {
    email: {
      functions: [isNotEmpty],
      warnings: ["Inserisici la tua email"]
    }
  },
  2: {
    password: {
      functions: [isNotEmpty],
      warnings: ["Scegli una password"]
    },
    confirmPassword: {
      functions: [isNotEmpty],
      warnings: ["Conferma la password inserita"]
    }
  },
  3: {
    phone: {
      functions: [isNotEmpty],
      warnings: ["Inserisci il tuo numero"]
    }
  }
};
