import { UserSerializer, GeneralUser } from "./ProfileTypes";

export interface GeneralBook {
  isbn: string;
  title: string;
  author: string;
  subject: GeneralSubject;
}

export interface GeneralSubject {
  _id: number;
  title: string;
}

export enum ItemCondition {
  Good = 0,
  Medium = 1,
  Bad = 2
}

export type ItemConditionType = 0 | 1 | 2;

export const ItemConditionToText = ["Come nuovo", "Usato", "Molto usato"];

export interface BasicItem {
  pk: number;
  description: string;
  price: number;
  condition: ItemConditionType;
  book: GeneralBook;
  image_ad: string[];
}

export interface SearchResultObject extends BasicItem {
  seller: UserSerializer;
}

export interface GeneralItem extends BasicItem {
  comment_ad: unknown[]; //ToDo
  enabled: boolean;
  seller: GeneralUser;
}

export interface ReducedItem {
  pk: number;
  book: GeneralBook;
  seller: UserSerializer;
  image_ad: string[];
  enabled?: boolean;
}