import { GeneralBook, ItemCondition } from "../../types/ItemTypes";

export const SELL_SUCCESS = "SELL_SUCCESS";
export const SELL_FAIL = "SELL_FAIL";
export const SELL_SET_BOOKS = "SELL_SET_BOOKS";
export const SELL_SET_GENERAL_INFO = "SELL_SET_GENERAL_INFO";

export interface SellType {
  items: SellItem[];
  loading?: boolean;
  error?: unknown;
}

export interface SellItem {
  book?: GeneralBook;
  price?: string;
  condition?: ItemCondition;
  description?: string;
  image_ad: SellImage[];
}

export interface SellImage {
  base64?: string;
  uri?: string;
}

export interface CheckingImage extends SellImage {
  width: number;
  height: number;
}

export interface GeneralInfoItem {
  book: GeneralBook;
  price?: string;
  condition?: ItemCondition;
  description?: string;
  completed?: boolean;
}

export interface PictureSelectorItem {
  book: GeneralBook;
  price?: string;
  condition?: ItemCondition;
  description?: string;
  image_ad: SellImage[];
  completed?: boolean;
}

/**
 * Actions
 */

export interface SellSuccessAction {
  type: typeof SELL_SUCCESS;
}

export interface SellFailAction {
  type: typeof SELL_FAIL;
  payload: {
    error: unknown;
  };
}

export interface SellSetBooks {
  type: typeof SELL_SET_BOOKS;
  payload: {
    books: GeneralBook[];
  };
}

export interface SellSetGeneralInfo {
  type: typeof SELL_SET_GENERAL_INFO;
  payload: {
    info: GeneralInfoItem;
    index: number;
  };
}

export type TSellActions =
  | SellSuccessAction
  | SellFailAction
  | SellSetBooks
  | SellSetGeneralInfo;
