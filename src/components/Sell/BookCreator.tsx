import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { GeneralBook } from "../../types/ItemTypes";
import LabeledInput from "../Inputs/LabeledInput";
import BadgedInput from "../Inputs/BadgedInput";
import update from "immutability-helper";
import Button from "../Touchables/Button";

interface BookCreatorProps {
  createBook: (book: GeneralBook) => void;
  closeBookCreator: () => void;
}

const BookCreator = ({
  createBook: remoteCreateBook,
  closeBookCreator
}: BookCreatorProps) => {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authorsList, setAuthorsList] = useState([]);

  const createBook = () => {
    closeBookCreator();
  };

  const onAddAuthor = () => {
    setAuthorsList(list => update(list, { $push: [author] }));
    setAuthor("");
  };

  const onDeleteAuthor = (index: number) => {
    setAuthorsList(list => update(list, { $splice: [[index, 1]] }));
  };

  return (
    <View>
      <LabeledInput
        label="ISBN"
        placeholder="Inserisci il codice ISBN"
        containerStyle={styles.field}
        value={isbn}
        onChangeText={setIsbn}
      />
      <LabeledInput
        label="TITOLO"
        placeholder="Inserisci il titolo"
        containerStyle={styles.field}
        value={title}
        onChangeText={setTitle}
      />
      <BadgedInput
        label="AUTORI"
        placeholder="Inserisci il/gli autori"
        contentContainerStyle={[styles.field]}
        value={author}
        onChangeText={setAuthor}
        badges={authorsList}
        onAdd={onAddAuthor}
        onDelete={onDeleteAuthor}
        listStyle={styles.authorList}
      />

      <View style={styles.actionsContainer}>
        <Button
          type="secondary"
          onPress={closeBookCreator}
          value="Annulla"
          style={styles.btn}
        />
        <Button
          type="primary"
          onPress={createBook}
          value="Aggiungi"
          style={styles.btn}
        />
      </View>
    </View>
  );
};

export default BookCreator;

const styles = StyleSheet.create({
  field: {
    marginTop: 20
  },
  authorList: {},
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },
  btn: {
    flex: 1
  }
});
