import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { GeneralBook } from "../../types/itemTypes";
import Shadows from "../Shadows";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Header1, Header3, Header4, Header2 } from "../Text";
import { printAuthors } from "../../utils/helper";
import { NavigationContext } from "react-navigation";

interface BookHeaderProps {
  book: GeneralBook;
  goBack?: () => void;
}

const BookHeader = ({ book, goBack: remoteGoBack }: BookHeaderProps) => {
  const navigation = useContext(NavigationContext);

  const goBack = () => {
    if (remoteGoBack) remoteGoBack();
    else navigation.goBack(null);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Icon name="chevron-left" style={styles.backIcon} size={24} />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Header2 color={"black"}>{book.title}</Header2>
        <Header4 color={"grey"}>Di {printAuthors(book.authors)}</Header4>
      </View>
    </View>
  );
};

export default BookHeader;

const styles = StyleSheet.create({
  container: {
    ...Shadows[3],
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white
  },
  backBtn: {
    padding: 15,
    borderRadius: 999
  },
  backIcon: {
    color: colors.black
  },
  contentContainer: {}
});
