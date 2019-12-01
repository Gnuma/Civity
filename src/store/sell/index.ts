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
  SELL_START
} from "./types";

import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import FormData from "form-data";
import RNFS from "react-native-fs";
import {
  ___BASE_UPLOAD_PICTURE___,
  ___CREATE_AD___,
  ___MODIFY_AD___
} from "../endpoints";
import { GeneralBook } from "../../types/ItemTypes";
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

export const sellSetBooks = (books: GeneralBook[]): TSellActions => ({
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
    dispatch({ type: SELL_START });
    setTimeout(() => {
      dispatch(sellSuccess());
      resolve();
    }, 2000);
  });

/*
    const isbn = "978889152023";
    const price = 16;
    const condition = 0;

    const { items } = getState().sell;
    const data = new FormData();
    try {
      let images = "";

      items[0].image_ad.forEach(item => {
        images += item.base64;
      });

      await RNFS.writeFile(
        RNFS.DocumentDirectoryPath + "/test.txt",
        images,
        "utf8"
      );

      data.append("images", {
        uri: "file://" + RNFS.DocumentDirectoryPath + "/test.txt",
        type: "text/plain",
        name: "images"
      });

      data.append("isbn", isbn);
      data.append("price", price);
      data.append("condition", condition);

      const result = await axios.post(
        "http://192.168.178.105:8000/gnuma/v1/ads/",
        data,
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data`,
            Authorization: "Token 5d4b05c0e74a397efbdb384c5855f86b244808c9"
          }
        }
      );
      console.log(result);
    } catch (e) {
      console.log({ e });
    }
    */
