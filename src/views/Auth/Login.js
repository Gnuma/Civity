import React, { Component } from "react";
import { View, Keyboard } from "react-native";
import { Header1, Header3 } from "../../components/Text";
import SolidButton from "../../components/SolidButton";
import OutlinedInput from "../../components/Form/OutlinedInput";
import { submit, isEmpty, fieldCheck } from "../../utils/validatorOLD.js";
import ErrorMessage from "../../components/Form/ErrorMessage";
import FullButton from "../../components/FullButton";
import colors from "../../styles/colors";

export default class Login extends Component {
  state = {
    fields: {
      0: {
        uid: {
          value: "",
          errorMessage: ""
        },
        pwd: {
          value: "",
          errorMessage: ""
        }
      }
    },
    error: ""
  };

  continue = async () => {
    const { status } = this.props;
    const stateFields = this.state.fields[status];
    const stateValidators = validators[status];
    this.props.setLoading(true);
    const result = await submit(stateFields, stateValidators);
    this.props.setLoading(false);
    if (result === true) {
      this.setState({ error: "" });
      if (status !== 0) {
        this.props.goNext();
      } else {
        Keyboard.dismiss();

        const { fields } = this.state;
        const uid = fields[0].uid.value;
        const pwd = fields[0].pwd.value;

        this.props
          .login(uid, pwd)
          .then(res => {
            const { isActive, token } = res;
            console.log(isActive);
            if (isActive !== false) {
              this.props.completeAuth(token);
            } else {
              this.props.goValidation();
            }
          })
          .catch(err => {
            console.log({ err });
            //this.setState({ error: "Login Error: " + err.response.status });
            this.setState({ error: "Nome utente o password non validi" });
          });
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
  };

  checkField = (key, goNext) => {
    const newState = fieldCheck(
      this.state.fields[this.props.status][key],
      validators[this.props.status][key]
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

  _renderLogin = () => (
    <View style={{ alignItems: "center" }}>
      <OutlinedInput
        placeholder="Username"
        value={this.state.fields[0].uid.value}
        onTextChange={text => this.handleChange("uid", text)}
        onSubmitEditing={() => this.checkField("uid")}
        onFocus={this.props.hideFooter}
      />
      <OutlinedInput
        placeholder="Password"
        textContentType="password"
        value={this.state.fields[0].pwd.value}
        onTextChange={text => this.handleChange("pwd", text)}
        onSubmitEditing={() => this.checkField("pwd", true)}
        secureTextEntry={true}
        onFocus={this.props.hideFooter}
      />
    </View>
  );

  _getContent = () => {
    switch (this.props.status) {
      case 0:
        return this._renderLogin();
      default:
        return null;
    }
  };

  render() {
    const { status } = this.props;
    const error = this.state.error;

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1
          }}
        >
          {this._getContent()}
          {!!error && <ErrorMessage message={error} />}
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <FullButton
              onPress={this.continue}
              value={status === 0 ? "Accedi" : "Continua"}
              contentStyle={{
                flex: 1,
                textAlign: "center",
                color: colors.primary
              }}
              style={{ marginHorizontal: 8 }}
              color={"white"}
            />
          </View>
        </View>
      </View>
    );
  }
}

const validators = {
  0: {
    uid: {
      functions: [isEmpty],
      warnings: ["Inserisci il nome"]
    },
    pwd: {
      functions: [isEmpty],
      warnings: ["Inserisci la password"]
    }
  }
};
