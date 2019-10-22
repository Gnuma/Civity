import uuid from "uuid";
import {
  OffertStatus,
  OrderedShoppingData,
  OrderedSalesData,
  ChatCategoryType,
  ChatCategoryIdType,
  SalesData,
  GeneralMessage
} from "../store/chat_Deprecated/types";
import { ___READ_CHAT___ } from "../store/endpoints";
import axios from "axios";
import { UserSerializer } from "../types/ProfileTypes";

export const getSubjectIndex = (
  subjectID: ChatCategoryIdType,
  orderedData: OrderedShoppingData[]
): number => {
  console.log(orderedData, subjectID);
  for (let i = 0; i < orderedData.length; i++) {
    console.log(orderedData[i].subjectID, subjectID);
    if (orderedData[i].subjectID == subjectID) return i;
  }
  return -1;
};

export const getItemIndex = (
  itemID: ChatCategoryIdType,
  orderedData: OrderedSalesData[]
): number => {
  for (let i = 0; i < orderedData.length; i++) {
    if (orderedData[i].itemID == itemID) return i;
  }
  return -1;
};

export const highlightItem = (array: any[], index: number): any[] =>
  array.splice(index, 1).concat(array);

export const createOffert = (
  user: UserSerializer,
  price: number,
  pk: number
) => ({
  creator: user,
  createdAt: new Date(),
  value: price,
  status: OffertStatus.PENDING,
  _id: pk
});

export const createSystemMessage = (text: string): GeneralMessage => ({
  createdAt: new Date(),
  _id: uuid.v4(),
  text,
  system: true,
  is_read: false
});
