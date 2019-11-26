import { ActionsObservable } from "redux-observable";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";

import {
  SELL_SUCCESS,
  SELL_FAIL,
  TSellActions,
  SELL_SET_BOOKS,
  GeneralInfoItem,
  SELL_SET_GENERAL_INFO
} from "./types";

import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import FormData from "form-data";
import {
  ___BASE_UPLOAD_PICTURE___,
  ___CREATE_AD___,
  ___MODIFY_AD___
} from "../endpoints";
import { GeneralBook } from "../../types/ItemTypes";

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
