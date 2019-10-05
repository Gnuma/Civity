import { updateObject } from "../utility";
import update from "immutability-helper";
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAIL,
  SEARCH_SUGGEST,
  SEARCH_SET_ACTIVE,
  SEARCH_SET_SEARCHQUERY,
  SEARCH_GO_HOME,
  SEARCH_UPDATE_HISTORY,
  SEARCH_LOAD_MORE_SUCCESS,
  SEARCH_LOAD_MORE_FAIL,
  SEARCH_LOAD_MORE_START,
  SearchType,
  TSearchActions,
  SearchSetSearchQueryAction,
  SearchStartAction,
  SearchSuccessAction,
  SearchFailAction,
  SearchSuggestAction,
  SearchSetActiveAction,
  SearchGoHomeAction,
  SearchUpdateHistoryAction,
  SearchLoadMoreStartAction,
  SearchLoadMoreSuccessAction,
  SearchLoadMoreFailAction
} from "./types";

const initialState: SearchType = {
  results: undefined, //search items results
  resultType: undefined,
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
  bookIsbn: undefined
};

const searchSetSearchQuery = (
  state: SearchType,
  action: SearchSetSearchQueryAction
): SearchType => {
  return updateObject(state, {
    searchQuery: action.payload.search_query
  });
};

const searchStart = (
  state: SearchType,
  action: SearchStartAction
): SearchType => {
  return updateObject(state, {
    error: undefined,
    loading: true,
    searchQuery: action.payload.search_query,
    isActive: false,
    showResults: true,
    results: undefined,
    resultType: undefined,
    page: 1,
    isLast: false,
    isLoadingMore: false,
    bookIsbn: action.payload.isbn
  });
};

const searchSuccess = (
  state: SearchType,
  { payload: { results, resultType, last } }: SearchSuccessAction
): SearchType => {
  return updateObject(state, {
    results: results, //generateResults(10).results, //test
    resultType,
    isLast: last, //test false
    page: 1,

    error: undefined,
    loading: false
  });
};

const searchFail = (
  state: SearchType,
  action: SearchFailAction
): SearchType => {
  return updateObject(state, {
    error: action.payload.error,
    loading: false
  });
};

const searchSuggest = (
  state: SearchType,
  action: SearchSuggestAction
): SearchType => {
  return updateObject(state, {
    suggestions: action.payload.suggestions
  });
};

const searchSetActive = (
  state: SearchType,
  action: SearchSetActiveAction
): SearchType => {
  return updateObject(state, {
    isActive: action.payload.isActive
  });
};

const searchGoHome = (
  state: SearchType,
  action: SearchGoHomeAction
): SearchType => {
  return updateObject(state, {
    showResults: false,
    searchQuery: "",
    isActive: false,
    suggestions: []
  });
};

const searchUpdateHistory = (
  state: SearchType,
  { payload: { recent } }: SearchUpdateHistoryAction
): SearchType =>
  update(state, {
    recent: {
      $set: recent
    }
  });

const searchLoadMoreStart = (
  state: SearchType,
  action: SearchLoadMoreStartAction
): SearchType =>
  updateObject(state, {
    isLoadingMore: true
  });

const searchLoadMoreSuccess = (
  state: SearchType,
  { payload: { data, page, isLast } }: SearchLoadMoreSuccessAction
): SearchType =>
  update(state, {
    results: { $push: data }, //test data generateResults(10).results
    page: { $set: page },
    isLast: { $set: isLast }, //test isLast,
    isLoadingMore: { $set: false }
  });

const searchLoadMoreFail = (
  state: SearchType,
  { payload: { error } }: SearchLoadMoreFailAction
): SearchType =>
  updateObject(state, {
    error,
    isLast: true,
    isLoadingMore: { $set: false }
  });

const reducer = (state = initialState, action: TSearchActions): SearchType => {
  switch (action.type) {
    case SEARCH_START:
      return searchStart(state, action);

    case SEARCH_SUCCESS:
      return searchSuccess(state, action);

    case SEARCH_FAIL:
      return searchFail(state, action);

    case SEARCH_SUGGEST:
      return searchSuggest(state, action);

    case SEARCH_SET_ACTIVE:
      return searchSetActive(state, action);

    case SEARCH_SET_SEARCHQUERY:
      return searchSetSearchQuery(state, action);

    case SEARCH_GO_HOME:
      return searchGoHome(state, action);

    case SEARCH_UPDATE_HISTORY:
      return searchUpdateHistory(state, action);

    case SEARCH_LOAD_MORE_SUCCESS:
      return searchLoadMoreSuccess(state, action);

    case SEARCH_LOAD_MORE_FAIL:
      return searchLoadMoreFail(state, action);

    case SEARCH_LOAD_MORE_START:
      return searchLoadMoreStart(state, action);

    default:
      return state;
  }
};

export default reducer;
