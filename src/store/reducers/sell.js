import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";
import _ from "lodash";
import { SellType } from "../../utils/constants";

const initialState = {
  previews: {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
  },
  previewsOrder: [0, 1, 2, 3, 4],
  checking: [],
  book: null,
  isbn: "",
  title: "",

  price: "",
  conditions: null,
  description: "",
  loading: false,
  error: null,
  type: SellType.NEW,
  itemModId: null
};

const takePreview = (state, action) => {
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

const deletePreview = (state, action) => {
  const index = state.previewsOrder[action.payload.index];
  return update(state, {
    previews: {
      [index]: { $set: null }
    }
  });
};

const setPreviewsOrder = (state, action) => {
  return updateObject(state, {
    previewsOrder: action.payload.order
  });
};

const selectBook = (state, action) => {
  return updateObject(state, {
    book: action.payload.book,
    isbn: "",
    title: ""
  });
};

const createBook = (state, action) => {
  return updateObject(state, {
    isbn: action.payload.isbn,
    title: action.payload.title,
    book: null
  });
};

const setPrice = (state, action) => {
  return updateObject(state, {
    price: action.payload.price
  });
};

const setConditions = (state, action) => {
  return updateObject(state, {
    conditions: action.payload.conditions
  });
};

const setDescription = (state, action) => {
  return updateObject(state, {
    description: action.payload.description
  });
};

const sellStart = (state, action) => {
  return updateObject(state, {
    loading: true
  });
};

const sellSuccess = (state, action) => {
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

const sellFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.payload.error
  });
};

const sellAddReview = (state, action) => {
  const data = _.isArray(action.payload.data)
    ? action.payload.data
    : [action.payload.data];
  return update(state, {
    checking: { $push: data }
  });
};

const sellRemoveReview = (state, action) => {
  return update(state, {
    checking: { $splice: [[0, 1]] }
  });
};

const sellStartSelling = () => initialState;

const sellStartModifying = (state, { payload: { item } }) => {
  let previews = Object.assign({}, initialState.previews);
  item.image_ad.forEach((value, index) => {
    previews[index] = { uri: value };
  });
  const { pk, description, condition, price, book } = item;

  return update(initialState, {
    type: { $set: SellType.MODIFY },
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELL_START:
      return sellStart(state, action);

    case actionTypes.SELL_SUCCESS:
      return sellSuccess(state, action);

    case actionTypes.SELL_FAIL:
      return sellFail(state, action);

    case actionTypes.SELL_TAKEPREVIEW:
      return takePreview(state, action);

    case actionTypes.SELL_DELETE_PREVIEW:
      return deletePreview(state, action);

    case actionTypes.SELL_SET_PREVIEWSORDER:
      return setPreviewsOrder(state, action);

    case actionTypes.SELL_SELECTBOOK:
      return selectBook(state, action);

    case actionTypes.SELL_CREATEBOOK:
      return createBook(state, action);

    case actionTypes.SELL_SET_PRICE:
      return setPrice(state, action);

    case actionTypes.SELL_SET_CONDITIONS:
      return setConditions(state, action);

    case actionTypes.SELL_SET_DESCRIPTION:
      return setDescription(state, action);

    case actionTypes.SELL_ADD_REVIEW:
      return sellAddReview(state, action);

    case actionTypes.SELL_REMOVE_REVIEW:
      return sellRemoveReview(state, action);

    case actionTypes.SELL_START_SELLING:
      return sellStartSelling(state, action);

    case actionTypes.SELL_START_MODIFYING:
      return sellStartModifying(state, action);

    default:
      return state;
  }
};

export default reducer;
