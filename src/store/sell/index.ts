import { ActionsObservable } from "redux-observable";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";

import {
  SELL_SUCCESS,
  SELL_FAIL,
  TSellActions,
  SELL_SET_BOOKS,
  GeneralInfoItem,
  SELL_SET_GENERAL_INFO,
  SellImage,
  SELL_SET_IMAGES,
  SELL_START,
  SellItem,
  SellBook
} from "./types";

import axios, { AxiosResponse } from "axios";
import RNFetchBlob from "rn-fetch-blob";
import FormData from "form-data";
import RNFS from "react-native-fs";
import {
  ___BASE_UPLOAD_PICTURE___,
  ___CREATE_AD___,
  ___MODIFY_AD___,
  ___CREATE_BOOK___
} from "../endpoints";
import { StoreType } from "../root";

export const sellSuccess = (): TSellActions => ({
  type: SELL_SUCCESS
});

export const sellFail = (error: unknown): TSellActions => ({
  type: SELL_FAIL,
  payload: {
    error
  }
});

export const sellSetBooks = (books: SellBook[]): TSellActions => ({
  type: SELL_SET_BOOKS,
  payload: {
    books
  }
});

export const sellSetGeneralInfo = (
  info: GeneralInfoItem,
  index: number
): TSellActions => ({
  type: SELL_SET_GENERAL_INFO,
  payload: {
    info,
    index
  }
});

export const sellSetImages = (
  image_ad: SellImage[],
  index: number
): TSellActions => ({
  type: SELL_SET_IMAGES,
  payload: {
    image_ad,
    index
  }
});

export const sellStart = (): ThunkAction<
  Promise<void>,
  StoreType,
  null,
  Action
> => (dispatch, getState) =>
  new Promise(async function(resolve, reject) {
    const { items } = getState().sell;
    dispatch({ type: SELL_START });
    try {
      const createBooks = await Promise.all(
        items
          .filter(item => item.book && item.book.isCreated)
          .map(item => item.book && SellCreateBook(item.book))
      );
      const result = await Promise.all(items.map(item => SellSingleItem(item)));
      console.log(result);
      dispatch(sellSuccess());
      resolve();
    } catch (error) {
      console.log(error);
      dispatch(sellFail(error));
      reject();
    }
  });

const SellSingleItem = (item: SellItem): Promise<AxiosResponse<any>> => {
  const data = new FormData();
  const { book, condition, description, image_ad, price } = item;
  if (!book) throw new Error("No book selected");

  item.image_ad.forEach(img => data.append("images", img.base64));
  data.append("isbn", book.isbn);
  data.append("price", price);
  data.append("condition", condition);
  description && data.append("description", description);

  return axios.post(___CREATE_AD___, data, {
    headers: {
      accept: "application/json",
      "Accept-Language": "en-US,en;q=0.8",
      "Content-Type": `multipart/form-data`
    }
  });
};

const SellCreateBook = (book: SellBook): Promise<AxiosResponse<any>> => {
  const { authors, isbn, subject, title } = book;
  return axios.post(___CREATE_BOOK___, {
    isbn,
    title,
    authors: authors.map(author => author.name),
    subject: subject._id || subject.title
  });
};
