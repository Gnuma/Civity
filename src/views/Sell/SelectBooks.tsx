import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ListRenderItem,
  SafeAreaView
} from "react-native";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { NavigationStackProp } from "react-navigation-stack";
import * as sellActions from "../../store/sell";
import { StoreType } from "../../store/root";
import { Header3, Header4, Text } from "../../components/Text";
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
import BottomSheet from "../../components/BottomSheet";
import CreateBook from "../../components/Sell/BookCreator";

interface SelectBooksProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

type SelectedBooksType = { [key: string]: GeneralBook | null };

interface SelectBooksState {
  searchQuery: string;
  booksResult: GeneralBook[];
  selectedBooks: SelectedBooksType;
  isBookCreatorOpen: boolean;
}

class SelectBooks extends Component<SelectBooksProps, SelectBooksState> {
  constructor(props: SelectBooksProps) {
    super(props);
    this.state = {
      searchQuery: "",
      booksResult: generateBooks(20),
      selectedBooks: props.selectedBooks,
      isBookCreatorOpen: false
    };
  }

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

  createBook = () => {};

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
    let selectedBooks = [];
    for (const key in this.state.selectedBooks) {
      if (this.state.selectedBooks.hasOwnProperty(key)) {
        selectedBooks.push(this.state.selectedBooks[key]);
      }
    }
    this.props.saveBooks(selectedBooks);
    this.props.navigation.navigate("SellGeneralInfos");
  };

  render() {
    const {
      searchQuery,
      booksResult,
      selectedBooks,
      isBookCreatorOpen
    } = this.state;
    let data: GeneralBook[] = Object.values(selectedBooks);
    data = data.filter(data => !!data);

    return (
      <View style={styles.container}>
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
              ListFooterComponent={() => (
                <Button
                  type="secondary"
                  value="Aggiungi libro"
                  onPress={() => this.toggleBookCreator(true)}
                />
              )}
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
        {isBookCreatorOpen && (
          <BottomSheet>
            <CreateBook
              createBook={this.createBook}
              closeBookCreator={() => this.toggleBookCreator(false)}
            />
          </BottomSheet>
        )}
      </View>
    );
  }

  renderBook: ListRenderItem<GeneralBook> = ({ item }) => {
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
  bookKeyExtractor = (book: GeneralBook) => book.isbn;

  toggleBookCreator = (isOpen: boolean) => {
    this.setState(state =>
      update(state, {
        isBookCreatorOpen: { $set: isOpen }
      })
    );
  };
}

interface ReduxStoreProps {
  selectedBooks: SelectedBooksType;
}

const mapStateToProps = (state: StoreType): ReduxStoreProps => {
  const selectedBooks: SelectedBooksType = state.sell.items.reduce(
    (obj: SelectedBooksType, item) => {
      if (item.book) obj[item.book.isbn] = item.book;
      return obj;
    },
    {}
  );
  return {
    selectedBooks
  };
};

interface ReduxDispatchProps {
  saveBooks: typeof sellActions.sellSetBooks;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): ReduxDispatchProps => ({
  saveBooks: books => dispatch(sellActions.sellSetBooks(books))
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectBooks);

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
