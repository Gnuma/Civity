import { ActionsObservable } from "redux-observable";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";

import {
  SELL_START,
  SELL_SUCCESS,
  SELL_FAIL,
  SELL_TAKEPREVIEW,
  SELL_ADD_REVIEW,
  SELL_REMOVE_REVIEW,
  SELL_SELECTBOOK,
  SELL_SET_PREVIEWSORDER,
  SELL_DELETE_PREVIEW,
  SELL_CREATEBOOK,
  SELL_START_SELLING,
  SELL_START_MODIFYING,
  SELL_SET_INFOS,
  TSellActions,
  PreviewImage,
  CheckingImage
} from "./types";
import NavigatorService from "../../navigator/NavigationService";
import { setItem, getItem, removeItem } from "../utility";
import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import FormData from "form-data";
import uuid from "uuid";
import {
  ___BASE_UPLOAD_PICTURE___,
  ___CREATE_AD___,
  ___MODIFY_AD___
} from "../endpoints";
import { ___BOOK_IMG_RATIO___, SellType } from "../../utils/constants";
import { chatNewItem, chatModifyItem } from "../chat_Deprecated";
import {
  GeneralBook,
  GeneralSubject,
  ItemCondition
} from "../../types/ItemTypes";
import { StoreType } from "../root";
import { GeneralItem } from "../../types/ItemTypes";

export const sellStart = (): TSellActions => ({
  type: SELL_START
});

export const sellSuccess = (): TSellActions => ({
  type: SELL_SUCCESS
});

export const sellFail = (error: unknown): TSellActions => ({
  type: SELL_FAIL,
  payload: {
    error
  }
});

export const takePreview = (data: PreviewImage): TSellActions => ({
  type: SELL_TAKEPREVIEW,
  payload: {
    data
  }
});

export const setPreviewsOrder = (order: number[]): TSellActions => ({
  type: SELL_SET_PREVIEWSORDER,
  payload: {
    order
  }
});

export const deletePreview = (index: number): TSellActions => ({
  type: SELL_DELETE_PREVIEW,
  payload: {
    index
  }
});

export const selectBook = (book: GeneralBook): TSellActions => ({
  type: SELL_SELECTBOOK,
  payload: {
    book
  }
});

export const createBook = (
  isbn: string,
  title: string,
  author: string = "Sconosciuto",
  subject: GeneralSubject
): TSellActions => ({
  type: SELL_CREATEBOOK,
  payload: {
    isbn,
    title,
    author,
    subject
  }
});

export const sellSetInfos = (
  conditions: ItemCondition,
  price: string,
  description: string
): TSellActions => ({
  type: SELL_SET_INFOS,
  payload: {
    conditions,
    price,
    description
  }
});

export const sellAddReview = (
  data: CheckingImage | CheckingImage[]
): TSellActions => ({
  type: SELL_ADD_REVIEW,
  payload: {
    data
  }
});

export const sellRemoveReview = (): TSellActions => ({
  type: SELL_REMOVE_REVIEW
});

export const sellSetStartSelling = (): TSellActions => ({
  type: SELL_START_SELLING
});

export const sellSetStartModifying = (item: GeneralItem): TSellActions => ({
  type: SELL_START_MODIFYING,
  payload: {
    item
  }
});

export const submit = (): ThunkAction<void, StoreType, null, Action> => {
  return (dispatch, getState): Promise<void> => {
    return new Promise(async function(resolve, reject) {
      const {
        previews,
        previewsOrder,
        book,
        price,
        conditions,
        description,
        loading,
        type,
        itemModId
      } = getState().sell;
      if (loading) return reject("Running already");
      dispatch(sellStart());
      let data = new FormData();
      let counter = 0;
      for (let i = 0; i < previewsOrder.length; i++) {
        let img = previews[previewsOrder[i]];
        if (img !== null) {
          if (!img.base64) {
            try {
              if (!img.uri) throw "Image Uri not found";
              img.base64 = await getBase64IP(img.uri);
            } catch (err) {
              console.log(err);
            }
          }
          data.append(counter.toString(), img.base64);
          counter++;
        }
      }

      if (!book) throw "Book undefined error";
      data.append("isbn", book.isbn);
      data.append("price", price);
      data.append("condition", conditions);
      data.append("description", description);

      let endpoint;
      if (type === SellType.MODIFY) {
        endpoint = ___MODIFY_AD___;
        data.append("item", itemModId);
      } else {
        endpoint = ___CREATE_AD___;
      }

      if (counter > 0) {
        axios
          .post(endpoint, data, {
            headers: {
              accept: "application/json",
              "Accept-Language": "en-US,en;q=0.8",
              "Content-Type": `multipart/form-data`
            }
          })
          .then(res => {
            console.log(res);
            type === SellType.NEW
              ? dispatch(chatNewItem(res.data.item))
              : dispatch(chatModifyItem(res.data));
            dispatch(sellSuccess());
            resolve();
          })
          .catch(err => {
            console.warn("Something went wrongato", "Error in creation");
            dispatch(sellFail(err));
            reject(err);
          });
      } else {
        dispatch(sellFail("No images selected"));
        reject("No images selected");
      }
    });
  };
};

export const sellStartSelling = (): ThunkAction<
  void,
  StoreType,
  null,
  Action
> => dispatch => {
  dispatch(sellSetStartSelling());
  NavigatorService.navigate("Camera");
};

export const sellStartModifying = (
  item: GeneralItem
): ThunkAction<void, StoreType, null, Action> => dispatch => {
  dispatch(sellSetStartModifying(item));
  NavigatorService.navigate("Camera");
};

const getBase64IP = (uri: string): Promise<string> =>
  new Promise((resolve, reject) => {
    let imagePath = "";
    RNFetchBlob.config({
      fileCache: true
    })
      .fetch("GET", uri)
      .then(resp => {
        imagePath = resp.path();
        return resp.readFile("base64");
      })
      .then(base64Data => {
        RNFetchBlob.fs.unlink(imagePath);
        resolve(base64Data);
      })
      .catch(err => reject(err));
  });
