import React, { Component } from "react";
import { View, TextInput } from "react-native";
import Button from "../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
export default class CommentComposer extends Component {
  _local_onSend = () => {
    if (this.props.value) this.props.onSend();
  };

  render() {
    const { onTextChange, value, autoFocus, onBlur } = this.props;
    return (
      <View>
        <View style={{ padding: 8, flexDirection: "row" }}>
          <TextInput
            style={{
              flex: 1,
              fontSize: 18,
              padding: 8,
              elevation: 4,
              backgroundColor: "white",
              justifyContent: "center",
              borderBottomLeftRadius: 6,
              borderTopLeftRadius: 6,
              maxHeight: 80
            }}
            placeholder={"Fai una domanda"}
            onChangeText={onTextChange}
            value={value}
            multiline={true}
            maxLength={280}
            autoFocus={autoFocus}
            onBlur={onBlur}
          />
          <Button
            style={{
              width: 50,
              backgroundColor: "white",
              elevation: 5,
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={this._local_onSend}
            disabled={!value.length > 0}
          >
            <Icon
              name={"paper-plane"}
              size={22}
              style={{ color: value ? colors.primary : null }}
            />
          </Button>
        </View>
      </View>
    );
  }
}
