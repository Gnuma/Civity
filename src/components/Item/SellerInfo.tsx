import React from "react";
import { View, Text } from "react-native";
import { GeneralUser } from "../../types/ProfileTypes";
import { Header3 } from "../Text";
import styles from "./styles";

interface SellerInfoProps {
  seller: GeneralUser;
}

const SellerInfo = ({ seller }: SellerInfoProps) => {
  return (
    <View style={styles.userContainer}>
      <View style={styles.usernameContainer}>
        <Header3 style={styles.username}>{seller.user.username}</Header3>
      </View>
      <View style={styles.locationContainer}>
        <Header3 style={styles.office} numberOfLines={2}>
          {seller.course.office.name}
        </Header3>
        <Header3 style={styles.officeLocation}>
          {seller.course.office.address}
        </Header3>
      </View>
    </View>
  );
};

export default SellerInfo;
