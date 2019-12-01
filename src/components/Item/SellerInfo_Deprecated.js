import React, { Component } from "react";
import { Text, View } from "react-native";
import { SellerInfoStyles as styles } from "./styles_Deprecated";
import { Header2, Header4, Header3, Username } from "../Text";
import Button from "../Button";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import SolidButton from "../SolidButton";
import Divider from "../Divider";
import UsernameInfo from "../UsernameInfo";
import { getLevel } from "../../utils/helper";
import { ProBadge } from "../Badge";
import { ITEM_BORDER_RADIUS } from "../ListItem/styles";
import { UserType } from "../../utils/constants";

export default ({ data, isPreview, reportItem }) => {
  const { user } = data;
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.firstRow}>
          <Username
            username={user.username}
            userInfo={data}
            size={22}
            containerStyle={{ marginRight: 10, flex: 1 }}
          />
          <View>
            {data.usertype === UserType.PRO && (
              <ProBadge
                style={{
                  marginLeft: 10,
                  borderTopLeftRadius: ITEM_BORDER_RADIUS,
                  borderBottomRightRadius: ITEM_BORDER_RADIUS
                }}
              />
            )}
          </View>
        </View>
        <View>
          <View style={styles.sellerInfoContainer}>
            <View style={styles.sellerInfoBox}>
              <UsernameInfo userInfo={data} size={45} hideLevel />
            </View>
            <Icon size={20} name="arrow-right" style={styles.sellerInfoArrow} />
            <Header3>{data.respect}% feedback positivi</Header3>
          </View>
          <View style={styles.sellerInfoContainer}>
            <View style={styles.sellerInfoBox}>
              <UsernameInfo userInfo={data} size={45} hideFeedback />
            </View>
            <Icon size={20} name="arrow-right" style={styles.sellerInfoArrow} />
            <Header3>{getLevel(data.xp).level}° livello</Header3>
          </View>
        </View>
      </View>
      {!isPreview && (
        <View>
          <Divider style={{ marginVertical: 8 }}></Divider>
          <SolidButton
            icon="flag"
            iconSize={20}
            style={{ paddingVertical: 6 }}
            iconStyle={{ color: colors.darkRed }}
            onPress={reportItem}
          >
            <Header3 color="primary" numberOfLines={1}>
              Segnala
            </Header3>
          </SolidButton>
        </View>
      )}
    </View>
  );
};

/**
 * BETA COPIES
 * 
    <View style={styles.buttonListContainer}>
        <SolidButton icon="heart" iconSize={20}>
          <Header4 color={"primary"}>Salva Venditore</Header4>
        </SolidButton>
        <SolidButton icon="star" iconSize={20}>
          <Header4 color={"primary"}>Salva Inserzione</Header4>
        </SolidButton>
        <SolidButton icon="exclamation-triangle" iconSize={20}>
          <Header4 color={"primary"}>Segnala Inserzione</Header4>
        </SolidButton>
      </View>

      <View style={styles.exploreIconContainer}>
          <Button>
            <Icon name="chevron-right" size={22} />
          </Button>
        </View>
 */
