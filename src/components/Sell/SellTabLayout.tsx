import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ListRenderItem,
  ScrollView
} from "react-native";
import Selectable from "../Touchables/Selectable";
import { GeneralBook } from "../../types/ItemTypes";
import colors from "../../styles/colors";
import Shadows from "../Shadows";
import { Header2, Header4, Header1, Text } from "../Text";
import Button from "../Touchables/Button";

interface SellTabLayoutProps {
  data: GeneralBook[];
  state: number;
  onGoBack: () => void;
  onContinue: () => void;
  onSwitchTab: (item: GeneralBook, index: number) => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

const SellTabLayout = ({
  state,
  data,
  onGoBack,
  onContinue,
  onSwitchTab,
  children,
  disabled
}: SellTabLayoutProps) => {
  const renderTab: ListRenderItem<GeneralBook> = ({ item, index }) => {
    return (
      <Selectable
        onPress={() => onSwitchTab(item, index)}
        classType="green"
        value={item.title}
        style={{ maxWidth: 140 }}
        selected={index === state}
        textProps={{ numberOfLines: 1 }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <FlatList
          data={data}
          keyExtractor={item => item.isbn}
          renderItem={renderTab}
          horizontal={true}
          contentContainerStyle={styles.badgeListContainer}
          ItemSeparatorComponent={() => <View style={styles.w10} />}
        />
        <View style={styles.bookInfo}>
          <Header1 style={styles.bookTitle} color="primary" numberOfLines={1}>
            {data[state].title}
          </Header1>
          <Header4 style={styles.bookAuthor} numberOfLines={1}>
            Di {data[state].author}
          </Header4>
        </View>
      </View>
      <View style={styles.viewContainer}>
        <ScrollView>{children}</ScrollView>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.button}>
          <Button type="secondary" value="Indietro" />
        </View>
        <View style={styles.button}>
          <Button type="primary" value={"Avanti "} disabled={disabled}>
            <Text style={styles.buttonCounter}>
              ({state + 1}/{data.length})
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default SellTabLayout;

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewContainer: {
    flex: 1,
    marginHorizontal: 10
  },
  headerContainer: {
    backgroundColor: colors.white,
    ...Shadows[3]
  },
  badgeListContainer: {
    marginVertical: 10,
    paddingHorizontal: 10
  },
  w10: {
    width: 10
  },
  bookInfo: {
    marginHorizontal: 10,
    marginBottom: 10
  },
  bookTitle: {
    fontSize: 28
  },
  bookAuthor: {
    color: colors.darkGrey,
    fontSize: 16,
    lineHeight: 16
  },
  actionContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  button: {
    flex: 1,
    marginHorizontal: 5
  },
  buttonCounter: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white
  }
});

/*

export default class SellTabLayout extends Component<
  SellTabLayoutProps,
  SellTabLayoutState
> {
  };

  selectBook = (book: GeneralBook) => {
    this.setState(state =>
      update(state, {
        selectedBooks: {
          [book.isbn]: {
            $apply: item => (item ? null : book)
          }
        }
      })
    );
  };

  onSwitchTab = (index: number) => {
    this.setState({ focusedIndex: index });
  };

  renderHeaderEmpty = () => {
    return (
      <View style={styles.headerEmpty}>
        <Header2 color={"primary"}>Seleziona i libri che vuoi vendere</Header2>
      </View>
    );
  };

  renderTab: ListRenderItem<GeneralBook> = ({ item, index }) => {
    return (
      <Selectable
        onPress={() => this.onSwitchTab(index)}
        type="primary"
        value={item.title}
        style={{ marginLeft: 10, marginVertical: 10, maxWidth: 140 }}
        selected={index === this.state.focusedIndex}
        textProps={{ numberOfLines: 1 }}
      />
    );
  };

  render() {
    const {
      focusedIndex,
      searchQuery,
      booksResult,
      selectedBooks
    } = this.state;
    let data: GeneralBook[] = Object.values(selectedBooks);
    data = data.filter(data => !!data);

    return (
      <View style={styles.container}>
        <TabView
          data={data}
          renderEmpty={this.renderHeaderEmpty}
          state={focusedIndex}
          renderTab={this.renderTab}
        >
          <View style={styles.viewContainer}>
            <TextInputField
              placeholder="Cerca il tuo libro"
              containerStyle={styles.searchBar}
              value={searchQuery}
              onChangeText={this.onChangeSearchQuery}
              icon={<SearchIcon size={25} color={colors.black} />}
            />
            <FlatList
              data={booksResult}
              renderItem={this.renderBook}
              keyExtractor={this.bookKeyExtractor}
              extraData={selectedBooks}
            />
          </View>
        </TabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewContainer: {
    flex: 1,
    marginHorizontal: 10
  },
  headerEmpty: {
    justifyContent: "center",
    alignItems: "center"
  },
  searchBar: {
    marginVertical: 20
  },
  bookContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10
  }
});

*/
