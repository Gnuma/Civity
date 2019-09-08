import React, { Component } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BasicHeader from "../components/BasicHeader";
import { Header3, Header2, Header1 } from "../components/Text";
import FullButton from "../components/FullButton";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../styles/colors";

export class CivityProInfoScreen extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <BasicHeader title={"Civity PRO"} textStyle={{ fontSize: 24 }} />
          <View style={{ flex: 1 }}>
            <ScrollView>
              <Section
                title="Maggiore visibilità"
                text="Le tue inserzioni rimarrano in cima alle ricerche per più tempo."
              />
              <Section
                title="Vendite infinite"
                text="Puoi pubblicare tutte le inserzioni che vuoi"
              />
              <Section
                title="Civity PRO “Badge”"
                text="Le tue inserzioni riceveranno il badge Civity PRO."
              />
              <Section title="Niente Pubblicità" />
            </ScrollView>
          </View>
          <View>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <Header1 style={{ fontSize: 30 }} color="primary">
                €
                <Header1 style={{ fontSize: 36 }} color="primary">
                  2.99
                </Header1>
                /Anno
              </Header1>
              <Header3 color="black">Non rinnovato automaticamente</Header3>
            </View>
            <FullButton
              value={"Coming soon..."}
              disabled
              contentStyle={{ flex: 1, textAlign: "center" }}
              style={{ marginVertical: 10, marginHorizontal: 20 }}
              icon={"chevron-right"}
              color={"secondary"}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CivityProInfoScreen);

const Section = ({ title, text }) => {
  return (
    <View style={{ flexDirection: "row", marginHorizontal: 10, marginTop: 20 }}>
      <View
        style={{ width: 40, justifyContent: "center", alignItems: "center" }}
      >
        <Icon name="plus" size={32} style={{ color: colors.secondary }}></Icon>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Header2 color="black" style={{ textAlign: "center" }}>
          {title}
        </Header2>
        {text && (
          <Header3 color="black" style={{ textAlign: "center" }}>
            {text}
          </Header3>
        )}
      </View>
      <View style={{ width: 40 }}></View>
    </View>
  );
};
