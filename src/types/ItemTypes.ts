import { UserSerializer } from "./ProfileTypes";

export interface GeneralBook {
  isbn: string;
  title: string;
  author: string;
  subject?: GeneralSubject;
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

export interface BasicItem {
  pk: number;
  description: string;
  price: number;
  condition: ItemConditionType;
  book: GeneralBook;
}

export interface SearchResultObject extends BasicItem {
  seller: UserSerializer;
}
