import { GeneralBook, ItemCondition } from "../../types/itemTypes";

export interface SellType {
  previews: Array<PreviewImage>; //Todo
  previewsOrder: Array<number>;
  checking: Array<unknown>; //Todo
  book: GeneralBook;
  price: string;
  conditions: ItemCondition;
  description: string;
  loading: boolean;
  error: unknown;
  type: SellProcessType;
  itemModId: number;
}

export interface PreviewImage {
  base64?: string;
  uri?: string;
}

export interface CheckingImage extends PreviewImage {
  width: number;
  height: number;
}

export type SellProcessType = "NEW" | "MODIFY";
