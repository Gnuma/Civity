import React, { Component } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import GenericHeader from "../../components/GenericHeader";
import {
  ValidatorObject,
  isNotEmpty,
  isAvailablePhone,
  phoneLengthValidator
} from "../../utils/validator";
import ActionBar from "../../components/ActionBar";
import { NavigationStackProp } from "react-navigation-stack";
import CodeInput from "../../components/Inputs/CodeInput";

interface ConfirmPhoneScreenProps {
  navigation: NavigationStackProp;
}

interface ConfirmPhoneScreenState {
  isConfirming: boolean;
  code: string[];
}

export class ConfirmPhoneScreen extends Component<
  ConfirmPhoneScreenProps,
  ConfirmPhoneScreenState
> {
  state = {
    isConfirming: true,
    code: [...Array(5)].map(() => "")
  };

  continue = () => {};

  renderConfirmation = () => {
    return;
  };
  renderChangePhone = () => {};

  onCodeChange = (code: string[]) => this.setState({ code });

  render() {
    const { isConfirming, code } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <GenericHeader title="Verifica il numero" />
        <View style={styles.content}>
          <CodeInput code={code} onTextChange={this.onCodeChange}></CodeInput>
        </View>
        <ActionBar
          containerStyle={styles.actionBar}
          onContinue={this.continue}
          goBack={this.goBack}
          continueProps={{ value: isConfirming ? "Conferma" : "Modifica" }}
        />
      </SafeAreaView>
    );
  }

  goBack = () => {};
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPhoneScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 10, paddingVertical: 20 },
  actionBar: {
    padding: 10
  }
});

const Validator: ValidatorObject = {
  phone: {
    functions: [isNotEmpty, isAvailablePhone, phoneLengthValidator],
    warnings: [
      "Inserisci il tuo numero",
      "Il numero inseito è già stato utilizzato per un altro account",
      "Il numero inserito non sembra essere valido"
    ]
  }
};
