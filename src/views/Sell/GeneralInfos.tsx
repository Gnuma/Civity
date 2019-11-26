import React, { Component } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import SellTabLayout from "../../components/Sell/SellTabLayout";
import {
  generateItemOnlyBooks,
  generateBooks
} from "../../utils/testingHelpers";
import { GeneralBook, ItemCondition } from "../../types/ItemTypes";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { NavigationStackProp } from "react-navigation-stack";
import * as sellActions from "../../store/sell";
import { StoreType } from "../../store/root";
import LabeledInput from "../../components/Inputs/LabeledInput";
import PriceInput from "../../components/Inputs/PriceInput";
import LabeledField from "../../components/Inputs/LabeledField";
import Selectable, {
  SelectableClassType
} from "../../components/Touchables/Selectable";
import update from "immutability-helper";
import { GeneralInfoItem } from "../../store/sell/types";

interface GeneralInfosProps extends ReduxStoreProps, ReduxDispatchProps {
  navigation: NavigationStackProp;
}

interface GeneralInfosState {
  data: GeneralInfoItem[];
  state: number;
}

class GeneralInfos extends Component<GeneralInfosProps, GeneralInfosState> {
  constructor(props: GeneralInfosProps) {
    super(props);
    this.state = {
      data: props.itemsData,
      state: 0
    };
  }

  continue = () => {
    this.props.navigation.navigate("SellPicturesSelector");
  };

  onChangePrice = (price: string) =>
    this.setState(state =>
      update(state, {
        data: {
          [state.state]: { price: { $set: price }, completed: { $set: false } }
        }
      })
    );

  onChangeNotes = (description: string) =>
    this.setState(state =>
      update(state, {
        data: {
          [state.state]: {
            description: { $set: description },
            completed: { $set: false }
          }
        }
      })
    );

  onConditionChange = (condition: ItemCondition) =>
    this.setState(state =>
      update(state, {
        data: {
          [state.state]: {
            condition: { $set: condition },
            completed: { $set: false }
          }
        }
      })
    );

  render() {
    const { data, state } = this.state;
    const { price, condition, description } = data[state];
    const books = data.map(item => ({
      ...item.book,
      completed: item.completed
    }));

    return (
      <SellTabLayout
        state={state}
        data={books}
        onContinue={this.complete}
        onGoBack={this.goBack}
        onSwitchTab={this.switchTab}
        onNavigationGoBack={this.navigationGoBack}
        disableConfirm={!this.canComplete()}
      >
        <View style={styles.container}>
          <PriceInput
            label="PREZZO *"
            containerStyle={styles.field}
            value={price}
            onChangeText={this.onChangePrice}
          />
          <LabeledField label="CONDIZIONI *" containerStyle={styles.field}>
            <View style={styles.conditionContainer}>
              {CONDITIONS_ARRAY.map((value, index) => (
                <Selectable
                  key={index}
                  value={value.name}
                  style={[styles.conditionSelectable]}
                  classType={value.color}
                  selected={condition == value.condition}
                  onPress={() => this.onConditionChange(value.condition)}
                />
              ))}
            </View>
          </LabeledField>
          <LabeledInput
            label="NOTE (Facoltativo)"
            placeholder="Aggiungi delle note"
            multiline
            containerStyle={styles.field}
            value={description}
            onChangeText={this.onChangeNotes}
          />
        </View>
      </SellTabLayout>
    );
  }

  complete = () => {
    const { data, state } = this.state;
    this.props.saveItem(data[state], state);
    this.setState(
      state =>
        update(state, {
          data: {
            [state.state]: {
              completed: { $set: true }
            }
          },
          state: {
            $apply: bookIndex => incrementIndex(state, bookIndex)
          }
        }),
      () => {
        let canContinue = true;
        const { data } = this.state;
        data.forEach(item => (canContinue = !!(canContinue && item.completed)));
        if (canContinue) this.continue();
      }
    );
  };

  goBack = () => {
    this.setState(state =>
      update(state, {
        state: {
          $apply: bookIndex => decrementIndex(state, bookIndex)
        }
      })
    );
  };

  switchTab = (item: GeneralBook, index: number) => {
    this.setState({
      state: index
    });
  };

  canComplete = () =>
    !!(
      this.state.data[this.state.state].price != null &&
      this.state.data[this.state.state].condition != null
    );

  navigationGoBack = () => this.props.navigation.goBack(null);
}

interface ReduxStoreProps {
  itemsData: GeneralInfoItem[];
}

const mapStateToProps = (state: StoreType): ReduxStoreProps => ({
  itemsData: state.sell.items.reduce(
    (itemsData: GeneralInfoItem[], { book, ...rest }) => {
      if (book)
        itemsData.push({
          book: book,
          ...rest,
          completed: !!(rest.price != null && rest.condition != null)
        });
      return itemsData;
    },
    []
  )
});

interface ReduxDispatchProps {
  saveItem: typeof sellActions.sellSetGeneralInfo;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): ReduxDispatchProps => ({
  saveItem: (info, index) =>
    dispatch(sellActions.sellSetGeneralInfo(info, index))
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInfos);

interface ConditionsObjectType {
  name: string;
  condition: ItemCondition;
  color: SelectableClassType;
}

const CONDITIONS_ARRAY: ConditionsObjectType[] = [
  { name: "Scarse", condition: ItemCondition.Bad, color: "red" },
  { name: "Buone", condition: ItemCondition.Medium, color: "yellow" },
  { name: "Ottime", condition: ItemCondition.Good, color: "green" }
];

const CONDITION_WIDTH =
  (Dimensions.get("window").width - 20 - 10 * 2) / CONDITIONS_ARRAY.length;

const styles = StyleSheet.create({
  container: { marginHorizontal: 10 },
  conditionContainer: { flexDirection: "row", justifyContent: "space-between" },
  conditionSelectable: { width: CONDITION_WIDTH },
  field: {
    marginTop: 40
  }
});

const incrementIndex = (
  state: GeneralInfosState,
  bookIndex: number
): number => {
  const right = state.data
    .slice(bookIndex + 1)
    .findIndex(item => !item.completed);
  const left = state.data
    .slice(0, bookIndex)
    .findIndex(item => !item.completed);
  if (right != -1) return right + bookIndex + 1;
  if (left != -1) return left;
  return bookIndex;
};

const decrementIndex = (
  state: GeneralInfosState,
  bookIndex: number
): number => {
  const left = state.data
    .slice(0, bookIndex)
    .findIndex(item => !item.completed);
  const right = state.data
    .slice(bookIndex + 1)
    .findIndex(item => !item.completed);
  if (left != -1) return left;
  else if (right != -1) return right + bookIndex + 1;
  else return Math.max(0, bookIndex - 1);
};
