import React, { Component } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import OutlinedInput from "../Form/OutlinedInput";
import LabeledInput from "../Form/LabeledInput";
import colors from "../../styles/colors";

export default class UserInfoForm extends Component {
  render() {
    const { fields, updateField, initialFields } = this.props;

    return (
      <ScrollView>
        <LabeledInput
          placeholder={"Username"}
          state={fields.uid}
          onTextChange={text => updateField("uid", text)}
          borderFocus={initialFields.uid.value != fields.uid.value}
        />
        <LabeledInput
          placeholder={"Email"}
          state={fields.email}
          onTextChange={text => updateField("email", text)}
          borderFocus={initialFields.email.value != fields.email.value}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({});
