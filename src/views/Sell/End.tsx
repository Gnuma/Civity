import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ListRenderItem,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { NavigationStackProp } from "react-navigation-stack";
import { StoreType } from "../../store/root";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { SellItem } from "../../store/sell/types";
import * as sellActions from "../../store/sell";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import { Header2 } from "../../components/Text";
import Divider from "../../components/Divider";
import ItemSmall from "../../components/Item/ItemSmall";
import Button from "../../components/Touchables/Button";
import { StackActions } from "react-navigation";

interface EndProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

const End = ({ data, quit, navigation }: EndProps) => {
  const renderItem: ListRenderItem<SellItem> = ({ item }) => {
    const itemRefactored = {
      ...item,
      image_ad: item.image_ad.map(img => img.uri)
    };
    const width = Dimensions.get("window").width - 15 * 2;
    return (
      <ItemSmall
        item={itemRefactored}
        width={width}
        height={width / 3}
        containerStyle={styles.itemContainer}
        icon="share"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.firstContent}>
          <Icon style={styles.check} name="check" size={80} />
          <Header2 style={styles.mainText}>
            I tuoi libri sono <Header2 style={[styles.bold]}>ora</Header2> in
            vendita
          </Header2>
        </View>
        <Divider style={styles.divider} />

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <View style={styles.secondaryContent}>
              <Header2 color="black" style={styles.secondaryText}>
                Vuoi vendere velocemente?
              </Header2>
              <View style={styles.horiz}>
                <View style={styles.flex1}>
                  <Icon name="share" size={30} />
                </View>
                <Header2 style={styles.mainText}>
                  Condividi le tue Inserzioni
                </Header2>
                <View style={styles.flex1}></View>
              </View>
            </View>
          )}
        />
      </View>
      <View style={styles.btnContainer}>
        <View style={styles.btn}>
          <Button
            type="secondary"
            value="Esci"
            onPress={() => {
              quit();
              navigation.navigate("SEARCH");
              navigation.dispatch(StackActions.popToTop());
            }}
          />
        </View>
        <View style={styles.btn}>
          <Button type="primary" value="Condividi" />
        </View>
      </View>
    </SafeAreaView>
  );
};

interface ReduxStoreProps {
  data: SellItem[];
}

const mapStateToProps = (state: StoreType): ReduxStoreProps => ({
  data: state.sell.items
});

interface ReduxDispatchProps {
  quit: typeof sellActions.sellQuit;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): ReduxDispatchProps => ({
  quit: () => dispatch(sellActions.sellQuit())
});

export default connect(mapStateToProps, mapDispatchToProps)(End);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  firstContent: {
    alignItems: "center"
  },
  check: {
    color: colors.secondary,
    marginTop: 10
  },
  mainText: {
    color: colors.black,
    fontSize: 24,
    lineHeight: 24,
    textAlign: "center",
    marginVertical: 10
  },
  secondaryText: {
    fontSize: 18,
    lineHeight: 18,
    textAlign: "center"
  },
  bold: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 24
  },
  divider: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2
  },
  secondaryContent: {
    marginTop: 20
  },
  flex1: { flex: 1, justifyContent: "center", alignItems: "center" },
  horiz: {
    flexDirection: "row"
  },
  itemContainer: {
    marginHorizontal: 15,
    marginBottom: 10
  },
  btnContainer: {
    flexDirection: "row",
    marginVertical: 15
  },
  btn: {
    flex: 1,
    marginHorizontal: 5
  }
});
