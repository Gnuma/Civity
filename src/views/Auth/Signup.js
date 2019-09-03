import React, { Component } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import OutlinedInput from "../../components/Form/OutlinedInput";
import {
  submit,
  isEmpty,
  fieldCheck,
  isInvalidEmail,
  notExist,
  isUsernameTaken,
  isEmailTaken,
  isPhoneTaken
} from "../../utils/validator.js";
import Button from "../../components/Button";
import { Header3, Header2, Header1 } from "../../components/Text";
import SolidButton from "../../components/SolidButton";
import colors from "../../styles/colors";
import ErrorMessage from "../../components/Form/ErrorMessage";
import PhonePicker from "../../components/PhonePicker";
import { StatusBar } from "../../components/StatusBar";
import OfficeButton from "../../components/Form/OfficeButton";
import FullButton from "../../components/FullButton";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.validators[SignupStatus.PASSWORD].confirmPwd.functions.push(
      this.isDifferentPwd
    );
    this.pwdValue = "";
  }

  state = {
    fields: {
      [SignupStatus.USERNAME]: {
        uid: {
          value: "",
          errorMessage: ""
        }
      },
      [SignupStatus.EMAIL]: {
        email: {
          value: "",
          errorMessage: ""
        }
      },
      [SignupStatus.PASSWORD]: {
        pwd: {
          value: "",
          errorMessage: ""
        },
        confirmPwd: {
          value: "",
          errorMessage: ""
        }
      },
      [SignupStatus.OFFICE]: {
        office: {
          value: "",
          errorMessage: ""
        }
      },
      [SignupStatus.PHONE]: {
        phone: {
          value: "",
          errorMessage: ""
        }
      }
    },
    error: ""
  };

  continue = async () => {
    const { status } = this.props;
    let stateFields;
    if (status === SignupStatus.OFFICE) {
      stateFields = { office: { value: this.props.office, errorMessage: "" } };
    } else {
      stateFields = this.state.fields[status];
    }
    const stateValidators = this.validators[status];
    this.props.setLoading(true);
    const result = await submit(stateFields, stateValidators);
    this.props.setLoading(false);
    if (result === true) {
      this.setState({ error: "" });
      if (status < LASTSTEP) {
        this.props.goNext();
      } else {
        Keyboard.dismiss();

        const { fields } = this.state;
        const uid = fields[SignupStatus.USERNAME].uid.value;
        const email = fields[SignupStatus.EMAIL].email.value;
        const pwd = fields[SignupStatus.PASSWORD].pwd.value;
        const confirmPwd = fields[SignupStatus.PASSWORD].confirmPwd.value;
        const phone = fields[SignupStatus.PHONE].phone.value;

        this.props
          .signup(uid, email, pwd, confirmPwd, phone)
          .then(({ token, isActive }) => {
            this.props.goValidation();
          })
          .catch(err =>
            //this.setState({ error: "Signup Error: " + err.response.status })
            this.setState({ error: "Impossibile registrare account" })
          );
      }
    } else {
      this.setState(prevState => ({
        fields: { ...prevState.fields, [status]: { ...result } }
      }));

      let errorList = "";
      for (var key in result) {
        if (result.hasOwnProperty(key)) {
          if (result[key].errorMessage) {
            if (errorList) errorList += "\n";
            errorList += result[key].errorMessage;
          }
        }
      }
      this.setState({ error: errorList });
    }
  };

  handleChange = (key, value) => {
    this.updateField(key, { value, errorMessage: "" });
    if (key == "pwd") this.pwdValue = value;
  };

  checkField = (key, goNext) => {
    const newState = fieldCheck(
      this.state.fields[this.props.status][key],
      this.validators[this.props.status][key]
    );
    this.updateField(key, newState, goNext);
  };

  updateField = (key, newState, goNext = false) => {
    const status = this.props.status;
    this.setState(
      prevState => ({
        ...prevState,
        fields: {
          ...prevState.fields,
          [status]: {
            ...prevState.fields[status],
            [key]: newState
          }
        }
      }),
      () => {
        if (goNext) this.continue();
      }
    );
  };

  _renderUsername = () => (
    <OutlinedInput
      placeholder="Username"
      textContentType="username"
      value={this.state.fields[SignupStatus.USERNAME].uid.value}
      onTextChange={text => this.handleChange("uid", text)}
      onSubmitEditing={() => this.checkField("uid", true)}
      onFocus={this.props.hideFooter}
    />
  );
  _renderEmail = () => (
    <OutlinedInput
      placeholder="Email"
      textContentType="emailAddress"
      value={this.state.fields[SignupStatus.EMAIL].email.value}
      onTextChange={text => this.handleChange("email", text)}
      onSubmitEditing={() => this.checkField("email", true)}
      autoFocus
      onFocus={this.props.hideFooter}
    />
  );
  _renderPwd = () => (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <OutlinedInput
        placeholder="Password"
        textContentType="password"
        value={this.state.fields[SignupStatus.PASSWORD].pwd.value}
        onTextChange={text => this.handleChange("pwd", text)}
        onSubmitEditing={() => this.checkField("pwd")}
        secureTextEntry={true}
        autoFocus
        onFocus={this.props.hideFooter}
      />
      <OutlinedInput
        placeholder="Conferma Password"
        value={this.state.fields[SignupStatus.PASSWORD].confirmPwd.value}
        onTextChange={text => this.handleChange("confirmPwd", text)}
        onSubmitEditing={() => this.checkField("confirmPwd", true)}
        secureTextEntry={true}
        onFocus={this.props.hideFooter}
      />
    </View>
  );

  _renderOffice = () => (
    <OfficeButton
      office={this.props.office}
      onPress={this.props.goChangeOffice}
    />
  );

  _renderPhone = () => (
    <PhonePicker
      placeholder="Cellulare"
      value={this.state.fields[SignupStatus.PHONE].phone.value}
      onTextChange={text => this.handleChange("phone", text)}
      onSubmitEditing={() => this.checkField("phone")}
      autoFocus
      onFocus={this.props.hideFooter}
      status={0}
      disableStatusBar
    />
  );

  _getContent = () => {
    switch (this.props.status) {
      case SignupStatus.USERNAME:
        return this._renderUsername();
      case SignupStatus.EMAIL:
        return this._renderEmail();
      case SignupStatus.PASSWORD:
        return this._renderPwd();
      case SignupStatus.OFFICE:
        return this._renderOffice();
      case SignupStatus.PHONE:
        return this._renderPhone();
      default:
        return null;
    }
  };

  render() {
    const { status } = this.props;
    const error = this.state.error;

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          data={["Username", "Email", "Password", "Istituto", "Cellulare"]}
          status={status}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center"
          }}
        >
          {this._getContent()}
          {!!error && <ErrorMessage message={error} />}
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <FullButton
              onPress={this.continue}
              value={status === LASTSTEP ? "Registrati" : "Continua"}
              contentStyle={{
                flex: 1,
                textAlign: "center",
                color: status === LASTSTEP ? colors.white : colors.primary
              }}
              style={{ marginHorizontal: 8 }}
              color={status === LASTSTEP ? "secondary" : "white"}
            />
          </View>
        </View>
      </View>
    );
  }

  getPwd = () => this.state.fields[SignupStatus.PASSWORD].pwd.value;

  isDifferentPwd = confirmPwd => {
    console.log(confirmPwd, "+", this.state.fields[SignupStatus.PASSWORD].pwd);
    const pwd = this.getPwd();
    console.log(pwd, confirmPwd);
    return pwd !== confirmPwd;
  };

  validators = {
    [SignupStatus.USERNAME]: {
      uid: {
        functions: [isEmpty, isUsernameTaken],
        warnings: ["Inserisci il nome", "L'Username è già preso"]
      }
    },
    [SignupStatus.EMAIL]: {
      email: {
        functions: [isEmpty, isInvalidEmail, isEmailTaken],
        warnings: [
          "Inserisci l'email",
          "L'email non è valida",
          "L'email è già utilizzata per un altro account"
        ]
      }
    },
    [SignupStatus.PASSWORD]: {
      pwd: {
        functions: [isEmpty],
        warnings: ["Inserisci la password"]
      },
      confirmPwd: {
        functions: [isEmpty],
        warnings: ["Reinserisci la password", "Le due password non combaciano"]
      }
    },
    [SignupStatus.OFFICE]: {
      office: {
        functions: [notExist],
        warnings: ["Inserisci l'istituto"]
      }
    },
    [SignupStatus.PHONE]: {
      phone: {
        functions: [isEmpty, isPhoneTaken],
        warnings: [
          "Inserisci il tuo numero di telefono",
          "Il telefono è già utilizzato per un altro account"
        ]
      }
    }
  };
}

const LASTSTEP = 4;

const SignupStatus = {
  USERNAME: 0,
  EMAIL: 1,
  PASSWORD: 2,
  OFFICE: 3,
  PHONE: 4
};
