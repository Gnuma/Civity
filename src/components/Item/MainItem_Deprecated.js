import React, { Component } from "react";
import {
  View,
  Animated,
  RefreshControl,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";
import { MainItemStyles as styles } from "./styles_Deprecated";
import {
  PrimaryInfo,
  DescriptionInfo,
  SecondaryInfo
} from "./ItemInfos_Deprecated";
import SellerInfo from "./SellerInfo_Deprecated";
import ImageSlider_Deprecated from "./ImageSlider_Deprecated";
import Divider from "../Divider";
import QuipuComment from "../Comments/QuipuComment";
import ContactButton_Deprecated from "./ContactButton_Deprecated";
import FullButton from "../FullButton";
import BlockedItemBar_Deprecated from "./BlockedItemBar_Deprecated";
import { KAV_BEHAVIOR } from "../../utils/constants";

export class MainItem_Deprecated extends Component {
  state = {
    scrollY: new Animated.Value(0),
    viewHeight: this.props.viewHeight,
    contactButtonHeight: 50,
    contactSnapY: 1500
  };

  scrollEvent = Animated.event(
    [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
    {
      useNativeDriver: true
    }
  );

  setContactButtonHeight = contactButtonHeight => {
    this.setState({
      contactButtonHeight
    });
  };

  render() {
    const {
      data,
      user,
      newComments,
      isOwner,
      refreshing,
      onRefresh,
      deleteItem,
      isContacted,
      chatSnapshot,
      reportItem
    } = this.props;
    const primaryData = {
      price: data.price,
      conditions: data.condition,
      office: data.seller.office,
      usertype: data.seller.usertype
    };
    const sellerData = data.seller;
    const secondaryData = {
      book: data.book
    };
    console.log(data.seller);

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={KAV_BEHAVIOR}>
        <Animated.ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={"handled"}
          ref={component => (this.scrollView = component)}
          onScroll={this.scrollEvent}
          scrollEventThrottle={1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ImageSlider_Deprecated
            style={styles.imageSlider}
            data={data.image_ad}
          />
          <View style={styles.content} onLayout={this._setContainerOffset}>
            <PrimaryInfo data={primaryData} />
            <SellerInfo data={sellerData} reportItem={reportItem} />
            <View
              style={{
                height: this.state.contactButtonHeight
              }}
              onLayout={event => {
                this.setState({ contactSnapY: event.nativeEvent.layout.y });
                console.log(event.nativeEvent);
              }}
            />
            {isOwner && (
              <FullButton
                value="Elimina Inserzione"
                icon="times"
                style={{ marginBottom: 10 }}
                contentStyle={{ flex: 1, textAlign: "center" }}
                color={"darkRed"}
                onPress={deleteItem}
              />
            )}
            <Divider style={styles.bigDivider} />
            <DescriptionInfo data={data.description} />
            <Divider style={styles.smallDivider} />
            <SecondaryInfo data={secondaryData} />
            <Divider style={styles.smallDivider} />
            {/*data.comments*/ true ? (
              <QuipuComment
                data={data.comment_ad}
                sellerPK={data.seller._id}
                scrollTo={this._scrollTo}
                ref={comments => (this.comments = comments)}
                user={user}
                itemPK={data.pk}
                newComments={newComments}
                chatSnapshot={chatSnapshot}
              />
            ) : null}
          </View>
          <ContactButton_Deprecated
            onContact={this.props.onContact}
            scrollY={this.state.scrollY}
            viewHeight={this.state.viewHeight}
            setContactButtonHeight={this.setContactButtonHeight}
            contactSnapY={this.containerOffset + this.state.contactSnapY}
            isOwner={isOwner}
            isContacted={isContacted}
          />
        </Animated.ScrollView>
        {data.enabled === false && (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              justifyContent: "center",
              alignItems: "center",
              padding: 10
            }}
            pointerEvents="box-only"
          >
            <BlockedItemBar_Deprecated />
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }

  _scrollTo = y => {
    //console.log(y);
    console.log(y);
    y += this.containerOffset;
    this.scrollView.getNode().scrollTo({ x: 0, y, animated: true });
  };

  _setContainerOffset = event => {
    const layout = event.nativeEvent.layout;
    this.containerOffset = layout.y;
  };

  containerOffset = 0;
}

export default MainItem_Deprecated;
