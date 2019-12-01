import {
  SellType,
  TSellActions,
  SELL_SUCCESS,
  SELL_FAIL,
  SellFailAction,
  SELL_SET_BOOKS,
  SellSetBooks,
  SellItem,
  SELL_SET_GENERAL_INFO,
  SellSetGeneralInfo,
  SELL_SET_IMAGES,
  SellSetImages,
  SELL_START,
  SellStart
} from "./types";
import { updateObject } from "../utility";
import update from "immutability-helper";

const initialState: SellType = {
  items: [],
  loading: false,
  error: undefined
};

const sellSuccess = (state: SellType): SellType => initialState;

const sellFail = (state: SellType, action: SellFailAction): SellType => {
  return updateObject(state, {
    loading: false,
    error: action.payload.error
  });
};

const sellSetBooks = (
  state: SellType,
  { payload: { books } }: SellSetBooks
): SellType =>
  update(state, {
    items: {
      $apply: (items: SellItem[]) => {
        console.log(books);
        const newItems: SellItem[] = [];
        type isbnsType = { [key: string]: SellItem };
        const isbns: isbnsType = items.reduce((obj: isbnsType, item) => {
          if (item.book) obj[item.book.isbn] = item;
          return obj;
        }, {});
        books.forEach(book => {
          if (book == null) return;
          if (isbns[book.isbn] != null) newItems.push(isbns[book.isbn]);
          else
            newItems.push({
              book,
              image_ad: []
            });
        });
        return newItems;
      }
    }
  });

const sellSetGeneralInfo = (
  state: SellType,
  {
    payload: {
      info: { completed, ...restInfo },
      index
    }
  }: SellSetGeneralInfo
) =>
  update(state, {
    items: {
      [index]: { $merge: restInfo }
    }
  });

const sellSetImages = (
  state: SellType,
  { payload: { image_ad, index } }: SellSetImages
) =>
  update(state, {
    items: {
      [index]: { $merge: { image_ad } }
    }
  });

const sellStart = (state: SellType, action: SellStart) =>
  update(state, {
    loading: { $set: true }
  });

const reducer = (state = initialState, action: TSellActions): SellType => {
  switch (action.type) {
    case SELL_SUCCESS:
      return sellSuccess(state);

    case SELL_FAIL:
      return sellFail(state, action);

    case SELL_SET_BOOKS:
      return sellSetBooks(state, action);

    case SELL_SET_GENERAL_INFO:
      return sellSetGeneralInfo(state, action);

    case SELL_SET_IMAGES:
      return sellSetImages(state, action);

    case SELL_START:
      return sellStart(state, action);

    default:
      return state;
  }
};

export default reducer;
