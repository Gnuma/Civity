import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import * as sellActions from "../store/actions/sell";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { GreyBar } from "../components/StatusBars";
import ItemHeader from "../components/Item/ItemHeader";
import MainItemPreview from "../components/Item/MainItemPreview";
import Button from "../components/Button";
import { Header2, Header3 } from "../components/Text";
import colors from "../styles/colors";
import LoadingOverlay from "../components/LoadingOverlay";
import protectedAction from "../utils/protectedAction";
import { SafeAreaView } from "react-navigation";
import Shadows from "../components/Shadows";

export class PreviewItem extends Component {
  static propTypes = {
    book: PropTypes.object,
    condition: PropTypes.any,
    description: PropTypes.any,
    image_ad: PropTypes.object,
    price: PropTypes.any,
    seller: PropTypes.object,
    loading: PropTypes.bool
  };

  state = { loading: false };

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  publish = () => {
    protectedAction().then(() => {
      this.props
        .submitRedux()
        .then(() => {
          this.props.navigation.navigate("SalesList");
        })
        .catch(err => {
          console.log("Nope.", err);
        });
    });
  };

  render() {
    const {
      book,
      image_ad: image_ad_object,
      previewsOrder,
      loading,
      ...rest
    } = this.props;
    let image_ad = [];
    for (let i = 0; i < previewsOrder.length; i++) {
      const index = previewsOrder[i];
      if (image_ad_object[index]) image_ad.push(image_ad_object[index]);
    }
    const data = { book, image_ad, ...rest };
    if (book) this.book = book;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <GreyBar />
        <ItemHeader
          handleGoBack={this.goBack}
          title={this.book.title}
          author={this.book.author}
        />
        <View style={{ flex: 1 }}>
          {book && (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <MainItemPreview data={data} />
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  backgroundColor: colors.white
                }}
              >
                <Button style={styles.publishButton} onPress={this.publish}>
                  <Header3 color={"white"}>Pubblica inserzione</Header3>
                </Button>
              </View>
            </View>
          )}
          {loading && <LoadingOverlay />}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  book: state.sell.book,
  condition: state.sell.conditions,
  description: state.sell.description,
  image_ad: state.sell.previews,
  previewsOrder: state.sell.previewsOrder,
  price: state.sell.price,
  seller: {
    _id: state.auth.id,
    office: state.auth.office,
    user: {
      username: state.auth.userData.username
    }
  },
  loading: state.sell.loading
});

const mapDispatchToProps = dispatch => ({
  submitRedux: () => dispatch(sellActions.submit())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewItem);

const styles = StyleSheet.create({
  publishButton: {
    backgroundColor: colors.secondary,
    ...Shadows[1],
    flexDirection: "row",
    padding: 8,
    justifyContent: "center",
    borderRadius: 6
  }
});
