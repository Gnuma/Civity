import AsyncStorage from "@react-native-community/async-storage";

export const updateObject = (
  oldObject: Object,
  updatedProprieties: Object
): any => {
  return {
    ...oldObject,
    ...updatedProprieties
  };
};

export const setItem = async (key: string, item: Object) => {
  try {
    const jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
    return jsonOfItem;
  } catch (error) {
    console.log(error);
  }
};

export const getItem = async (key: string) => {
  try {
    const item = await AsyncStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export const multiGet = async (keys: string[]) => {
  try {
    let items = await AsyncStorage.multiGet(keys);
    if (items == null) throw "No items found";
    for (let i = 0; i < items.length; i++) {
      if (items[i][1] !== null) items[i][1] = JSON.parse(items[i][1] || "");
    }
    return items;
  } catch (error) {
    console.log(error);
  }
};

export const isIsbn = (value: string) => {
  return /^\d+$/.test(value) && value.length >= 9 && value.length <= 13;
};
