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
  SellType,
  SellProcessTypeEnum,
  TSellActions,
  SellTakePreviewAction,
  SellDeletePreviewAction,
  SellSetPreviewsOrderAction,
  SellSelectBookAction,
  SellCreateBookAction,
  SellStartAction,
  SellSuccessAction,
  SellFailAction,
  SellAddReviewAction,
  SellRemoveReviewAction,
  SellSetStartSellingAction,
  SellSetStartModifyingAction,
  SellSetInfosAction,
  SELL_SET_INFOS
} from "./types";
import { updateObject } from "../utility";
import update from "immutability-helper";
import _ from "lodash";

const initialState: SellType = {
  previews: {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
  },
  previewsOrder: [0, 1, 2, 3, 4],
  checking: [],
  book: undefined,

  price: "",
  conditions: undefined,
  description: "",
  loading: false,
  error: undefined,
  type: SellProcessTypeEnum.NEW,
  itemModId: undefined
};

const takePreview = (
  state: SellType,
  action: SellTakePreviewAction
): SellType => {
  let index = -1;
  for (let i = 0; i < state.previewsOrder.length; i++) {
    index = state.previewsOrder[i];
    if (state.previews[index] === null) break;
  }
  return update(state, {
    previews: {
      [index]: { $set: action.payload.data }
    }
  });
};

const deletePreview = (
  state: SellType,
  action: SellDeletePreviewAction
): SellType => {
  const index = state.previewsOrder[action.payload.index];
  return update(state, {
    previews: {
      [index]: { $set: null }
    }
  });
};

const setPreviewsOrder = (
  state: SellType,
  action: SellSetPreviewsOrderAction
): SellType => {
  return updateObject(state, {
    previewsOrder: action.payload.order
  });
};

const selectBook = (
  state: SellType,
  action: SellSelectBookAction
): SellType => {
  return updateObject(state, {
    book: action.payload.book
  });
};

const createBook = (
  state: SellType,
  { payload: { title, isbn, author, subject } }: SellCreateBookAction
): SellType => {
  return updateObject(state, {
    book: {
      $set: {
        title,
        isbn,
        author,
        subject
      }
    }
  });
};

const sellStart = (state: SellType, action: SellStartAction): SellType => {
  return updateObject(state, {
    loading: true
  });
};

const sellSuccess = (state: SellType, action: SellSuccessAction): SellType => {
  return updateObject(state, {
    previews: {
      0: null,
      1: null,
      2: null,
      3: null,
      4: null
    },
    previewsOrder: [0, 1, 2, 3, 4],
    book: null,
    price: "",
    conditions: null,
    description: "",
    loading: false,
    error: null
  });
};

const sellFail = (state: SellType, action: SellFailAction): SellType => {
  return updateObject(state, {
    loading: false,
    error: action.payload.error
  });
};

const sellAddReview = (
  state: SellType,
  action: SellAddReviewAction
): SellType => {
  const data = _.isArray(action.payload.data)
    ? action.payload.data
    : [action.payload.data];
  return update(state, {
    checking: { $push: data }
  });
};

const sellRemoveReview = (
  state: SellType,
  action: SellRemoveReviewAction
): SellType => {
  return update(state, {
    checking: { $splice: [[0, 1]] }
  });
};

const sellStartSelling = (
  state: SellType,
  action: SellSetStartSellingAction
): SellType => initialState;

const sellStartModifying = (
  state: SellType,
  { payload: { item } }: SellSetStartModifyingAction
): SellType => {
  let previews = Object.assign({}, initialState.previews);
  item.image_ad.forEach((value, index) => {
    previews[index] = { uri: value };
  });
  const { pk, description, condition, price, book } = item;

  return update(initialState, {
    type: { $set: SellProcessTypeEnum.MODIFY },
    $merge: {
      previews,
      itemModId: pk,
      description,
      conditions: condition,
      price: price.toString(),
      book: book
    }
  });
};

const sellSetInfos = (
  state: SellType,
  { payload: { conditions, price, description } }: SellSetInfosAction
): SellType =>
  update(state, {
    $merge: { conditions, price, description }
  });

const reducer = (state = initialState, action: TSellActions): SellType => {
  switch (action.type) {
    case SELL_START:
      return sellStart(state, action);

    case SELL_SUCCESS:
      return sellSuccess(state, action);

    case SELL_FAIL:
      return sellFail(state, action);

    case SELL_TAKEPREVIEW:
      return takePreview(state, action);

    case SELL_DELETE_PREVIEW:
      return deletePreview(state, action);

    case SELL_SET_PREVIEWSORDER:
      return setPreviewsOrder(state, action);

    case SELL_SELECTBOOK:
      return selectBook(state, action);

    case SELL_CREATEBOOK:
      return createBook(state, action);

    case SELL_SET_INFOS:
      return sellSetInfos(state, action);

    case SELL_ADD_REVIEW:
      return sellAddReview(state, action);

    case SELL_REMOVE_REVIEW:
      return sellRemoveReview(state, action);

    case SELL_START_SELLING:
      return sellStartSelling(state, action);

    case SELL_START_MODIFYING:
      return sellStartModifying(state, action);

    default:
      return state;
  }
};

export default reducer;
