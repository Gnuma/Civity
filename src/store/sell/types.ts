import { GeneralBook, ItemCondition } from "../../types/ItemTypes";

export const SELL_SUCCESS = "SELL_SUCCESS";
export const SELL_FAIL = "SELL_FAIL";
export const SELL_SET_BOOKS = "SELL_SET_BOOKS";
export const SELL_SET_GENERAL_INFO = "SELL_SET_GENERAL_INFO";
export const SELL_SET_IMAGES = "SELL_SET_IMAGES";
export const SELL_START = "SELL_START";

export interface SellType {
  items: SellItem[];
  loading?: boolean;
  error?: unknown;
}

export interface SellItem {
  book?: SellBook;
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

export interface SellBook extends GeneralBook {
  isCreated?: boolean;
}

export interface GeneralInfoItem {
  book: SellBook;
  price?: string;
  condition?: ItemCondition;
  description?: string;
  completed?: boolean;
}

export interface PictureSelectorItem {
  book: SellBook;
  price?: string;
  condition?: ItemCondition;
  description?: string;
  image_ad: SellImage[];
}

export interface PreviewItem {
  book: SellBook;
  price: string;
  condition: ItemCondition;
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
    books: SellBook[];
  };
}

export interface SellSetGeneralInfo {
  type: typeof SELL_SET_GENERAL_INFO;
  payload: {
    info: GeneralInfoItem;
    index: number;
  };
}

export interface SellSetImages {
  type: typeof SELL_SET_IMAGES;
  payload: {
    image_ad: SellImage[];
    index: number;
  };
}

export interface SellStart {
  type: typeof SELL_START;
}

export type TSellActions =
  | SellSuccessAction
  | SellFailAction
  | SellSetBooks
  | SellSetGeneralInfo
  | SellSetImages
  | SellStart;
