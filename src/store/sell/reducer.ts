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
  SellSetGeneralInfo
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
              book
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
      [index]: { $set: restInfo }
    }
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

    default:
      return state;
  }
};

export default reducer;
