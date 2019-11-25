import React, { Component } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import SellTabLayout from "../../components/Sell/SellTabLayout";
import {
  generateBooks,
  generateItemOnlyBooks
} from "../../utils/testingHelpers";
import { GeneralBook, ItemCondition } from "../../types/ItemTypes";
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from "react-navigation";
import UnderlinedTextInput from "../../components/Inputs/UnderlinedTextInput";
import LabeledInput from "../../components/Inputs/LabeledInput";
import PriceInput from "../../components/Inputs/PriceInput";
import LabeledField from "../../components/Inputs/LabeledField";
import Selectable, {
  SelectableClassType
} from "../../components/Touchables/Selectable";
import update from "immutability-helper";

interface GeneralItemInfo {
  book: GeneralBook;
  price?: string;
  condition?: ItemCondition;
  notes?: string;
}

interface GeneralInfosProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface GeneralInfosState {
  data: GeneralItemInfo[];
  state: number;
}

export default class GeneralInfos extends Component<
  GeneralInfosProps,
  GeneralInfosState
> {
  state = {
    data: generateItemOnlyBooks(4),
    state: 0
  };

  continue = () => {};
  goBack = () => {};
  switchTab = () => {};

  onChangePrice = (price: string) =>
    this.setState(state =>
      update(state, {
        data: {
          [state.state]: { price: { $set: price } }
        }
      })
    );

  onChangeNotes = (notes: string) =>
    this.setState(state =>
      update(state, {
        data: {
          [state.state]: { notes: { $set: notes } }
        }
      })
    );

  onConditionChange = (condition: ItemCondition) =>
    this.setState(state =>
      update(state, {
        data: {
          [state.state]: { condition: { $set: condition } }
        }
      })
    );

  render() {
    const { data, state } = this.state;
    const { price, condition, notes } = data[state];
    const books = data.map(item => item.book);

    return (
      <SellTabLayout
        state={state}
        data={books}
        onContinue={this.continue}
        onGoBack={this.goBack}
        onSwitchTab={this.switchTab}
      >
        <View>
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
            value={notes}
            onChangeText={this.onChangeNotes}
          />
        </View>
      </SellTabLayout>
    );
  }
}

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
  conditionContainer: { flexDirection: "row", justifyContent: "space-between" },
  conditionSelectable: { width: CONDITION_WIDTH },
  field: {
    marginTop: 40
  }
});
