import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import update from "immutability-helper";
import { generateResults } from "../../mockData/SearchResults";

const initialState = {
  results: null, //search items results
  resultType: "",
  page: 1,
  isLast: false,
  isLoadingMore: false,
  error: null, //errors
  loading: false, //is loading results
  searchQuery: "", //search query,
  isActive: false,
  showResults: false,
  suggestions: [],
  recent: {
    order: [],
    keys: {}
  },
  bookIsbn: null
};

const searchSetSearchQuery = (state, action) => {
  return updateObject(state, {
    searchQuery: action.payload.search_query
  });
};

const searchStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    searchQuery: action.payload.search_query,
    isActive: false,
    showResults: true,
    results: null,
    resultType: "",
    page: 1,
    isLast: false,
    isLoadingMore: false,
    bookIsbn: action.payload.isbn
  });
};

const searchSuccess = (state, { payload: { results, resultType, last } }) => {
  return updateObject(state, {
    results: results, //generateResults(10).results, //test
    resultType,
    isLast: last, //test false
    page: 1,

    error: null,
    loading: false
  });
};

const searchFail = (state, action) => {
  return updateObject(state, {
    error: action.payload.error,
    loading: false
  });
};

const searchSuggest = (state, action) => {
  return updateObject(state, {
    suggestions: action.payload.suggestions
  });
};

const searchSetActive = (state, action) => {
  return updateObject(state, {
    isActive: action.payload.isActive
  });
};

const searchGoHome = (state, action) => {
  return updateObject(state, {
    showResults: false,
    searchQuery: "",
    isActive: false,
    suggestions: []
  });
};

const searchUpdateHistory = (state, { payload: { recent } }) =>
  update(state, {
    recent: {
      $set: recent
    }
  });

const searchLoadMoreStart = (state, action) =>
  updateObject(state, {
    isLoadingMore: true
  });

const searchLoadMoreSuccess = (state, { payload: { data, page, isLast } }) =>
  update(state, {
    results: { $push: data }, //test data generateResults(10).results
    page: { $set: page },
    isLast: { $set: isLast }, //test isLast,
    isLoadingMore: { $set: false }
  });

const searchLoadMoreFail = (state, { payload: { error } }) =>
  updateObject(state, {
    error,
    isLast: true,
    isLoadingMore: { $set: false }
  });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEARCH_START:
      return searchStart(state, action);

    case actionTypes.SEARCH_SUCCESS:
      return searchSuccess(state, action);

    case actionTypes.SEARCH_FAIL:
      return searchFail(state, action);

    case actionTypes.SEARCH_SUGGEST:
      return searchSuggest(state, action);

    case actionTypes.SEARCH_SET_ACTIVE:
      return searchSetActive(state, action);

    case actionTypes.SEARCH_SET_SEARCHQUERY:
      return searchSetSearchQuery(state, action);

    case actionTypes.SEARCH_GO_HOME:
      return searchGoHome(state, action);

    case actionTypes.SEARCH_UPDATE_HISTORY:
      return searchUpdateHistory(state, action);

    case actionTypes.SEARCH_LOAD_MORE_SUCCESS:
      return searchLoadMoreSuccess(state, action);

    case actionTypes.SEARCH_LOAD_MORE_FAIL:
      return searchLoadMoreFail(state, action);

    case actionTypes.SEARCH_LOAD_MORE_START:
      return searchLoadMoreStart(state, action);

    default:
      return state;
  }
};

export default reducer;
