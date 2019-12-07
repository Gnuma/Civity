import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import LabeledInput from "../Inputs/LabeledInput";
import BadgedInput from "../Inputs/BadgedInput";
import update from "immutability-helper";
import Button from "../Touchables/Button";
import { SellBook } from "../../store/sell/types";
import {
  ValidatorObject,
  isNotEmpty,
  isISBN,
  submit
} from "../../utils/validator";

interface BookCreatorProps {
  createBook: (book: SellBook) => void;
  closeBookCreator: () => void;
}

const BookCreator = ({
  createBook: remoteCreateBook,
  closeBookCreator
}: BookCreatorProps) => {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const authorsInitialState: string[] = [];
  const [authorsList, setAuthorsList] = useState(authorsInitialState);
  const [fieldWarnings, setFieldWarnings] = useState({
    isbn: "",
    title: "",
    author: ""
  });

  const createBook = () => {
    submit({ isbn, title }, Validator)
      .then(() => {
        remoteCreateBook({
          authors: authorsList.map(a => ({
            id: 0,
            name: a,
            last_name: "", //TODO
            books: [isbn]
          })),
          isbn,
          title,
          subject: { _id: 0, title: "matematica" } //TODO
        });
        closeBookCreator();
      })
      .catch(err =>
        setFieldWarnings(state =>
          update(state, {
            $merge: err
          })
        )
      );
  };

  const onAddAuthor = () => {
    if (author) {
      setAuthorsList(list => update(list, { $push: [author] }));
      setAuthor("");
    }
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
        warning={fieldWarnings.isbn}
      />
      <LabeledInput
        label="TITOLO"
        placeholder="Inserisci il titolo"
        containerStyle={styles.field}
        value={title}
        onChangeText={setTitle}
        warning={fieldWarnings.title}
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

const Validator: ValidatorObject = {
  isbn: {
    functions: [isNotEmpty, isISBN],
    warnings: [
      "Inserisici l'ISBN del libro",
      "L'ISBN inserito non sembra essere valido"
    ]
  },
  title: {
    functions: [isNotEmpty],
    warnings: ["Inserisici il titolo del libro"]
  }
};
