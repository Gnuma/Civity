import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
import colors from "../../styles/colors";
import { Header1, Header2, Header3 } from "../../components/Text";
import IconPlus from "../../media/vectors/plus-icon";
import CivityLogoBlack from "../../media/vectors/CivityLogoBlack";
import Button from "../../components/Touchables/Button";
import Divider from "../../components/Divider";

interface IntroProps {
  navigation: NavigationStackProp;
}

const Intro = ({ navigation }: IntroProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.quit}>
          <TouchableOpacity>
            <Icon name="times" size={30} color={colors.black} />
          </TouchableOpacity>
        </View>
        <Header1 color="black">Civity</Header1>
        <CivityLogoBlack size={85} color={colors.black} />
      </View>
      <View style={[styles.section, { padding: 10 }]}>
        <Header2 color="darkGrey" style={styles.callToAction}>
          Entra a far parte di Civity
        </Header2>
        <Divider style={styles.green} />
        <View style={styles.actionContainer}>
          <View style={styles.button}>
            <Button type="secondary" value="Accedi" />
          </View>
          <View style={styles.button}>
            <Button
              type="primary"
              value="Iscriviti"
              onPress={() => navigation.navigate("Signup")}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  section: {
    flex: 1,
    justifyContent: "flex-end"
  },
  quit: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10
  },
  callToAction: {
    alignSelf: "center",
    paddingBottom: 20
  },
  actionContainer: {
    flexDirection: "row",
    paddingVertical: 20
  },
  button: {
    flex: 1
  },
  green: {
    borderBottomColor: colors.secondary
  }
});
