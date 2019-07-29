import React, { Component } from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import styles from "./styles";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";

export default class SearchHeader extends Component {
  render() {
    const {
      clearSearchQuery,
      onChangeText,
      searchQuery,
      onSubmitEditing,
      onFocus,
      resetToHome,
      setSearchRef
    } = this.props;

    return (
      <View style={styles.headerContainer}>
        <Button onPress={resetToHome} style={styles.goBack}>
          <Icon name="chevron-left" size={24} style={styles.icon} />
        </Button>
        <View style={styles.searchBoxContainer}>
          <TextInput
            onChangeText={onChangeText}
            value={searchQuery}
            style={styles.searchInput}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={true}
            autoFocus={true}
            onFocus={onFocus}
            placeholder={"Cerca un libro"}
            ref={setSearchRef}
          />
          {searchQuery ? (
            <Button
              onPress={clearSearchQuery}
              style={[styles.p5, { marginRight: 3 }]}
            >
              <Icon name="times" size={24} style={styles.resetIcon} />
            </Button>
          ) : (
            <Icon name="search" size={24} style={styles.searchIcon} />
          )}
        </View>
      </View>
    );
  }
}
