import React, { Component } from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BasicHeader from "../components/BasicHeader";
import { Header2, Header1, Header3 } from "../components/Text";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import colors from "../styles/colors";
import LevelList from "../components/UserSettings/LevelList";
import SolidButton from "../components/SolidButton";
import Card from "../components/Card";
import ActionsList from "../components/UserSettings/ActionsList";
import CircleValue from "../components/CircleValue";
import Button from "../components/Button";
import * as authActions from "../store/actions/auth";
import Divider from "../components/Divider";
import { getLevel } from "../utils/helper";
import { LEVEL_DATA, IS_ANDROID } from "../utils/constants";
import { SafeAreaView } from "react-navigation";
import { ProBadge } from "../components/Badge";

const marginHorizontal = 20;

export class UserSettings extends Component {
  static propTypes = {
    userData: PropTypes.object,
    office: PropTypes.object
  };

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("willFocus", () => {
      StatusBar.setBarStyle(IS_ANDROID ? "light-content" : "dark-content");
      IS_ANDROID && StatusBar.setBackgroundColor(colors.darkGreen);
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  state = {
    viewRef: null
  };

  logout = () => {
    console.log("Logging Out..");

    setTimeout(() => {
      this.props.logout();
      this.props.navigation.navigate("Home");
    }, 100);
  };

  goUserInfo = () => {
    this.props.navigation.navigate("UserInfo");
  };

  goChangeOffice = () => {
    this.props.navigation.navigate("OfficeChange");
  };

  goChangePhone = () => {
    this.props.navigation.navigate("PhoneChange");
  };

  render() {
    const { office, userData, isActive, id } = this.props;
    if (!office || !userData) {
      return null;
    }
    const { level, exp } = getLevel(userData.xp);

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, overflow: "hidden" }}>
          <BasicHeader title="Il Tuo Profilo" />
          <View style={{ flex: 1 }}>
            <ScrollView>
              <UserInfoPanel
                onPress={this.goUserInfo}
                username={userData.username}
                email={userData.email}
              />
              <Divider
                style={{
                  marginHorizontal: marginHorizontal
                }}
              />
              <UserOfficePanel
                onPress={this.goChangeOffice}
                address={office.address}
                office={office.name}
              />
              <Divider
                style={{
                  marginHorizontal: marginHorizontal
                }}
              />
              <UserPhonePanel
                onPress={this.goChangePhone}
                phone={userData.phone}
                isActive={isActive}
              />
              <Divider
                style={{
                  marginHorizontal: marginHorizontal
                }}
              />
              <View
                style={{ marginHorizontal: marginHorizontal, marginTop: 5 }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Header1 color="black" style={{ flex: 1 }} numberOfLines={1}>
                    Livello
                  </Header1>
                  <Button
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 20
                    }}
                    onPress={() => this.setState({ showLevelInfo: true })}
                  >
                    <Icon
                      name={"question-circle"}
                      size={30}
                      style={{ color: colors.primary }}
                    />
                  </Button>
                </View>
              </View>
              <View style={{ marginVertical: 10 }}>
                <LevelList level={level} exp={exp} />
                <Header2 style={{ alignSelf: "center", marginTop: 5 }}>
                  <Header2
                    color="secondary"
                    style={{ fontWeight: "800", fontSize: 30 }}
                  >
                    {exp}
                  </Header2>
                  /{LEVEL_DATA[level]}
                </Header2>
              </View>
              <View
                style={{ marginHorizontal: marginHorizontal, marginTop: 15 }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Header2 style={{ flex: 1 }} numberOfLines={1} color="black">
                    Libri Acquistati
                  </Header2>
                  <Header1 color="black" style={{ fontWeight: "800" }}>
                    0
                  </Header1>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Header2 style={{ flex: 1 }} numberOfLines={1} color="black">
                    Libri Venduti
                  </Header2>
                  <Header1 color="black" style={{ fontWeight: "800" }}>
                    0
                  </Header1>
                </View>
              </View>
              <Divider
                style={{
                  marginHorizontal: 20,
                  marginVertical: 15
                }}
              />
              <ActionsList
                navigation={this.props.navigation}
                logout={this.logout}
                userData={userData}
                id={id}
              />
            </ScrollView>
          </View>
          {this.state.showLevelInfo && (
            <View
              style={{
                ...StyleSheet.absoluteFill,
                backgroundColor: "rgba(0,0,0,0.8)"
              }}
            >
              <TouchableWithoutFeedback onPress={this.dismissLevelInfo}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <LevelInfo dismiss={this.dismissLevelInfo} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  dismissLevelInfo = () => {
    this.setState({ showLevelInfo: false });
  };
}

const mapStateToProps = state => ({
  userData: state.auth.userData,
  office: state.auth.office,
  isActive: state.auth.isActive,
  id: state.auth.id
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(authActions.authLogout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSettings);

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

const LevelSample = () => {
  const data = [1, 2, 3, 4];
  const radius = (viewportWidth * 0.8) / (data.length * 2);

  function renderItem({ item }) {
    return (
      <CircleValue
        radius={radius}
        type={CircleValue.CircleValueType.LEVEL}
        value={item}
        inactive={item > 1}
        experience={(item == 1 && 70) || 0}
      />
    );
  }

  return (
    <View style={{ height: radius * 2, marginVertical: 6 }}>
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.toString()}
      />
    </View>
  );
};

const UserInfoPanel = ({
  onPress,
  username = "Francesco",
  email = "Francesco@test.com",
  emailStatus = "Non Validata"
}) => {
  return (
    <Button
      onPress={onPress}
      style={{ paddingHorizontal: marginHorizontal, paddingVertical: 15 }}
    >
      <View style={styles.panelHeader}>
        <Icon name={"user"} size={27} style={{ color: colors.secondary }} />
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            marginLeft: 10,
            alignItems: "center"
          }}
        >
          <Header1 color="black" numberOfLines={1}>
            {username}
          </Header1>
          <ProBadge
            style={{
              borderTopLeftRadius: 5,
              borderBottomRightRadius: 5,
              marginLeft: 10
            }}
            size={14}
          />
        </View>
        <Icon5 name={"pen"} size={25} style={{ color: colors.primary }} />
      </View>
      <View
        style={{ flexDirection: "row", marginTop: 10, alignItems: "flex-end" }}
      >
        <Header2 style={{ flex: 1 }} numberOfLines={1} color="black">
          {email}
        </Header2>
        <Header3 style={{ color: colors.darkRed }} numberOfLines={1}>
          {emailStatus}
        </Header3>
      </View>
    </Button>
  );
};

const UserOfficePanel = ({
  onPress,
  office = "Liceo Giulio Cesare",
  address = "Via Giacomo Peroni"
}) => {
  return (
    <Button
      onPress={onPress}
      style={{ paddingHorizontal: marginHorizontal, paddingVertical: 15 }}
    >
      <View style={styles.panelHeader}>
        <Icon
          name={"university"}
          size={23}
          style={{ color: colors.secondary }}
        />
        <Header2
          style={{ flex: 1, marginLeft: 10 }}
          color="black"
          numberOfLines={1}
        >
          {office}
        </Header2>
        <Icon5 name={"pen"} size={25} style={{ color: colors.primary }} />
      </View>
      <View
        style={{ flexDirection: "row", marginTop: 10, alignItems: "flex-end" }}
      >
        <Header2 style={{ flex: 1 }} numberOfLines={1} color="black">
          {address}
        </Header2>
      </View>
    </Button>
  );
};

UserPhonePanel = ({ phone = "1234567890", isActive = false, onPress }) => {
  return (
    <Button
      onPress={onPress}
      style={{ paddingHorizontal: marginHorizontal, paddingVertical: 15 }}
    >
      <View style={styles.panelHeader}>
        <Icon name={"phone"} size={30} style={{ color: colors.secondary }} />
        <Header2
          style={{ flex: 1, marginLeft: 10 }}
          color="black"
          numberOfLines={1}
        >
          {phone}
        </Header2>
        <Icon5 name={"pen"} size={25} style={{ color: colors.primary }} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 10
        }}
      >
        <Header3
          style={{ color: isActive ? colors.secondary : colors.darkRed }}
          numberOfLines={1}
        >
          {isActive ? "Validato" : "Non Validato"}
        </Header3>
      </View>
    </Button>
  );
};

const LevelInfo = ({ dismiss }) => {
  return (
    <Card
      style={{ margin: 10, justifyContent: "center", alignItems: "center" }}
    >
      <Header2 color="black">Livello Profilo</Header2>
      <LevelSample />
      <Header3 color="black" style={{ marginBottom: 4 }}>
        Sali di livello vendendo o acquistando libri, ottenendo feedback
        positivi dagli altri utenti o aiutando la comunità facendo report di bug
        o invitando nuovi utenti.
      </Header3>
      <SolidButton center onPress={dismiss}>
        <Header3 color="secondary" style={{ flex: 1, textAlign: "center" }}>
          Capito
        </Header3>
      </SolidButton>
    </Card>
  );
};

const styles = StyleSheet.create({
  panelHeader: {
    flexDirection: "row",
    alignItems: "center"
  }
});
