import React,.{useState} from "react";
import { View, StyleSheet } from "react-native";
import { GeneralBook } from "../../types/ItemTypes";
import LabeledInput from "../Inputs/LabeledInput";
import { useState } from "react";

interface BookCreatorProps {
  createBook: (book: GeneralBook) => void;
  
}

const BookCreator = ({ createBook }: BookCreatorProps) => {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [authorsList, setAuthorsList] = useState([]);
  const [state, setstate] = useState(initialState)

  return (
    <View>
      <LabeledInput
        label="NOTE (Facoltativo)"
        placeholder="Aggiungi delle note"
        multiline
        containerStyle={styles.field}
        value={description}
        onChangeText={this.onChangeNotes}
      />
    </View>
  );
};

export default CreateBook;

const styles = StyleSheet.create({
  field: {
    marginTop: 20,
  }
});
