import { GeneralBook, ItemCondition, GeneralItem } from "../../types/ItemTypes";

export const SELL_START = "SELL_START";
export const SELL_SUCCESS = "SELL_SUCCESS";
export const SELL_FAIL = "SELL_FAIL";
export const SELL_TAKEPREVIEW = "SELL_TAKEPREVIEW";
export const SELL_ADD_REVIEW = "SELL_NEW_REVIEW";
export const SELL_REMOVE_REVIEW = "SELL_REVIEW";
export const SELL_SELECTBOOK = "SELL_SELECTBOOK";
export const SELL_SET_PREVIEWSORDER = "SELL_SET_PREVIEWSORDER";
export const SELL_DELETE_PREVIEW = "SELL_DELETE_PREVIEW";
export const SELL_CREATEBOOK = "SELL_CREATEBOOK";
export const SELL_START_SELLING = "SELL_START_SELLING";
export const SELL_START_MODIFYING = "SELL_START_MODIFYING";
export const SELL_SET_INFOS = "SELL_SET_INFOS";

export interface SellType {
  previews: { [key: number]: PreviewImage | null };
  previewsOrder: Array<number>;
  checking: Array<CheckingImage>;
  book?: GeneralBook;
  price?: string;
  conditions?: ItemCondition;
  description?: string;
  loading: boolean;
  error?: unknown;
  type?: SellProcessType;
  itemModId?: number;
}

export interface PreviewImage {
  base64?: string;
  uri?: string;
}

export interface CheckingImage extends PreviewImage {
  width: number;
  height: number;
}

export enum SellProcessTypeEnum {
  NEW = "NEW",
  MODIFY = "MODIFY"
}

export type SellProcessType = "NEW" | "MODIFY";

export interface SellStartAction {
  type: typeof SELL_START;
}

export interface SellSuccessAction {
  type: typeof SELL_SUCCESS;
}

export interface SellFailAction {
  type: typeof SELL_FAIL;
  payload: {
    error: unknown;
  };
}

export interface SellTakePreviewAction {
  type: typeof SELL_TAKEPREVIEW;
  payload: {
    data: PreviewImage;
  };
}

export interface SellSetPreviewsOrderAction {
  type: typeof SELL_SET_PREVIEWSORDER;
  payload: {
    order: number[];
  };
}

export interface SellDeletePreviewAction {
  type: typeof SELL_DELETE_PREVIEW;
  payload: {
    index: number;
  };
}

export interface SellSelectBookAction {
  type: typeof SELL_SELECTBOOK;
  payload: {
    book: GeneralBook;
  };
}

export interface SellCreateBookAction {
  type: typeof SELL_CREATEBOOK;
  payload: GeneralBook;
}

export interface SellSetInfosAction {
  type: typeof SELL_SET_INFOS;
  payload: {
    conditions: ItemCondition;
    price: string;
    description: string;
  };
}

export interface SellAddReviewAction {
  type: typeof SELL_ADD_REVIEW;
  payload: {
    data: CheckingImage | CheckingImage[];
  };
}

export interface SellRemoveReviewAction {
  type: typeof SELL_REMOVE_REVIEW;
}

export interface SellSetStartSellingAction {
  type: typeof SELL_START_SELLING;
}

export interface SellSetStartModifyingAction {
  type: typeof SELL_START_MODIFYING;
  payload: {
    item: GeneralItem;
  };
}

export type TSellActions =
  | SellStartAction
  | SellSuccessAction
  | SellFailAction
  | SellTakePreviewAction
  | SellSetPreviewsOrderAction
  | SellDeletePreviewAction
  | SellSelectBookAction
  | SellCreateBookAction
  | SellSetInfosAction
  | SellAddReviewAction
  | SellRemoveReviewAction
  | SellSetStartSellingAction
  | SellSetStartModifyingAction;
