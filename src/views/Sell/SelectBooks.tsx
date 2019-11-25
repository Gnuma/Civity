import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ListRenderItem,
  SafeAreaView
} from "react-native";
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from "react-navigation";
import { Header2, Header3, Header4 } from "../../components/Text";
import TextInputField from "../../components/Inputs/SolidTextInput";
import SearchIcon from "../../media/vectors/SearchIcon";
import colors from "../../styles/colors";
import { GeneralBook } from "../../types/ItemTypes";
import { TouchableOpacity } from "react-native-gesture-handler";
import CheckBox from "../../components/Touchables/CheckBox";
import update from "immutability-helper";
import { generateBooks } from "../../utils/testingHelpers";
import BookBadgeList from "../../components/Sell/BookBadgeList";
import Shadows from "../../components/Shadows";
import Button from "../../components/Touchables/Button";

interface SelectBooksProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface SelectBooksState {
  searchQuery: string;
  booksResult: GeneralBook[];
  selectedBooks: { [key: string]: GeneralBook | null };
}

export default class SelectBooks extends Component<
  SelectBooksProps,
  SelectBooksState
> {
  state = {
    searchQuery: "",
    booksResult: generateBooks(20),
    selectedBooks: {}
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

  onRemoveBook = (id: string) => {
    this.setState(state =>
      update(state, {
        selectedBooks: {
          [id]: {
            $set: null
          }
        }
      })
    );
  };

  continue = () => {
    this.props.navigation.navigate("SellGeneralInfos");
  };

  render() {
    const { searchQuery, booksResult, selectedBooks } = this.state;
    let data: GeneralBook[] = Object.values(selectedBooks);
    data = data.filter(data => !!data);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <BookBadgeList data={data} onDelete={this.onRemoveBook} />
        </View>
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
          <Button
            value="Avanti"
            type="primary"
            disabled={data.length == 0}
            style={styles.continueButton}
            onPress={this.continue}
          ></Button>
        </View>
      </SafeAreaView>
    );
  }

  renderBook: ListRenderItem<GeneralBook> = ({ item, index }) => {
    const { selectedBooks } = this.state;
    return (
      <TouchableOpacity
        style={styles.bookContainer}
        onPress={() => this.selectBook(item)}
      >
        <View style={{ flex: 1 }}>
          <Header3 color="black">{item.title}</Header3>
          <Header4 color="lightGrey">{item.author}</Header4>
        </View>
        <CheckBox selected={selectedBooks[item.isbn] != null} />
      </TouchableOpacity>
    );
  };

  onChangeSearchQuery = (searchQuery: string) => {
    this.setState({
      searchQuery
    });
  };
  bookKeyExtractor = (book: GeneralBook, index: number) => book.isbn;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    ...Shadows[3],
    backgroundColor: colors.white,
    justifyContent: "center",
    height: 70
  },
  viewContainer: {
    flex: 1,
    marginHorizontal: 10
  },
  searchBar: {
    marginVertical: 20
  },
  bookContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10
  },
  continueButton: {
    marginVertical: 10
  }
});

/**
 *        <View style={{ marginVertical: 40 }}>
      <Text>{focusedIndex}</Text>
    </View>
    <Button
      onPress={() => this.props.navigation.navigate("PhotosList")}
      value="Photos example"
    />
 */
