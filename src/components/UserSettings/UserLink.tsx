import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { GeneralUser } from "../../types/ProfileTypes";
import { ChatUser } from "../../store/chat/types";
import colors from "../../styles/colors";
import Shadows from "../Shadows";
import { Header3 } from "../Text";
import { TouchableOpacity } from "react-native-gesture-handler";

interface UserLinkProps {
  user: ChatUser;
  containerStyle?: StyleProp<ViewStyle>;
}

const UserLink = ({ user, containerStyle }: UserLinkProps) => {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]}>
      <View style={styles.usernameContainer}>
        <Header3 style={styles.username}>{user.user.username}</Header3>
      </View>
      <View style={styles.locationContainer}>
        <Header3 style={styles.office} numberOfLines={2}>
          Università di Roma “La sapienza”
        </Header3>
        <Header3 style={styles.officeLocation}>Roma, (RM)</Header3>
      </View>
    </TouchableOpacity>
  );
};

export default UserLink;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    ...Shadows[2],
    borderRadius: 10,
    padding: 8
  },
  usernameContainer: { flexDirection: "row" },
  username: { flex: 1, fontSize: 22, fontWeight: "700", marginBottom: 6 },
  locationContainer: { flexDirection: "row" },
  office: { flex: 1 },
  officeLocation: {}
});
